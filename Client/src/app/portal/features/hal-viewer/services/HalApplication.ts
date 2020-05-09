import * as _ from 'lodash';
import {Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {ApiConnection, ConnectionDeletedEvent} from 'src/app/types/connection-types';
import {ConnectionService} from 'src/app/services/ConnectionService';
import {ResourceService} from './ResourceService';
import {ResourceInstance} from '../types/resource-types';
import {PopulatedLink} from '../types/link-types';
import {EventBusService} from '../../../../services/EventBusService';
import {RequestClientFactory} from 'src/app/common/client/RequestClientFactory';
import {take} from 'rxjs/operators';
import {IHalEntryPointResource, IHalResource} from '../../../../common/client/Resource';
import {EmbeddedItem} from '../../../../types/common-types';

// Represents the main entry-point for the hal-viewer application feature.
// This service maintains the currently selected connection and resources
// and coordinates with the required services to implement application
// functionality.
@Injectable()
export class HalApplication {

  // The current Api selections:
  public selectedConnection: ApiConnection;
  public selectedConnEntry: IHalEntryPointResource;

  // Stores the root-resources opened on a specific connection.
  private connectionRootResourceMap = new Map<string, ResourceInstance[]>();

  // Reference to collection of root resources associated with selected connection.
  // And the reference to the currently selected root resource within collection.
  public connectionRootResources: ResourceInstance[];
  public selectedRootResource: ResourceInstance;

  // The currently selected embedded resource information.
  public selectedEmbeddedResourceName: string;
  public selectedEmbeddedResource: ResourceInstance;
  public parentEmbeddedItems:  EmbeddedItem[];

  // Subjects:
  private entryResourceUpdated = new Subject<IHalEntryPointResource>();
  private rootResourceLoaded = new Subject<ResourceInstance>();

  constructor(
    private router: Router,
    private eventBus: EventBusService,
    private requestClientFactory: RequestClientFactory,
    private connectionService: ConnectionService,
    private resourceService: ResourceService) {

    this.subscribeToConnectionDeletion();
    this.subscribeToErrorResponse();

    this.resourceService.restoreOpenedResource(this.connectionRootResourceMap);
  }

  // ----------------------------------------------------------------------------------
  // --- Subscriptions:
  // ----------------------------------------------------------------------------------

  private subscribeToConnectionDeletion() {

    // Remove the collection id from the map storing the root-resources
    // loaded on that connection.
    this.eventBus.subscribe(ConnectionDeletedEvent.key).subscribe(event => {
      this.connectionRootResourceMap.delete(event.connectionId);

      this.selectedConnection = null;
      this.connectionRootResources = null;
      this.selectedRootResource = null;
    });
  }

  private subscribeToErrorResponse() {

    this.requestClientFactory.whenErrorResponse.subscribe(errorInfo => {
      if (this.selectedRootResource) {
        const errors = this.selectedRootResource.responseErrors;

        // Store the last 20 errors and place new errors at the top of the list.
        errors.unshift(errorInfo);
        if (errors.length > 20) {
          errors.length = 20;
        }
      }
    });
  }

  // ----------------------------------------------------------------------------------
  // --- Observables:
  // ----------------------------------------------------------------------------------

  // Observable called when a root-resource is loaded using the
  // current connection.
  public get whenRootResourceLoaded(): Observable<ResourceInstance> {
    return this.rootResourceLoaded.asObservable();
  }

  public get whenConnectionEntryUpdated(): Observable<IHalEntryPointResource> {
    return this.entryResourceUpdated.asObservable();
  }

  // ----------------------------------------------------------------------------------
  // --- Application Data:
  // ----------------------------------------------------------------------------------

  // The currently configured connections.
  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
  }

  // Returns current latest navigated to resource.  If no children resources
  // have been loaded (navigated to) from the root-resource, then the root
  // resources is the current resource.
  public get currentResource(): ResourceInstance {
    const childResources = this.selectedRootResource.childrenResources;

    if (childResources.length > 0) {
      return childResources[childResources.length - 1];
    }
    return this.selectedRootResource;
  }

  // The number of error associated with the root resource.
  public get rootResourceErrorCount(): number {
    if (this.selectedRootResource) {
      return this.selectedRootResource.responseErrors.length;
    }
    return 0;
  }

  public get isRootResourceSelected(): boolean {
    return this.selectedRootResource.instance === this.currentResource.instance;
  }

  // ----------------------------------------------------------------------------------
  // --- Link Execution:
  // ----------------------------------------------------------------------------------

  // Executes initial entry link returned from HAL based Web Api.
  // These are the links used to start communication with the Api.
  public executeEntryLink(populatedLink: PopulatedLink) {
    this.resourceService.executeLink(this.selectedConnection, populatedLink)
      .pipe( take(1)) // Dispose observable.
      .subscribe(apiResponse => {

        const rootResource = ResourceInstance.create(
          populatedLink,
          apiResponse.content,
          apiResponse.response.url);

        this.rootResourceLoaded.next(rootResource);
      });
  }

  // Loads child resource associated with parent as specified by the selected link.
  public executeResourceLink(populatedLink: PopulatedLink) {
    this.currentResource.useJsonAsContentEnabled = false;

    // Load the child resources specified by the link and associated with root resource.
    this.resourceService.executeLink(this.selectedConnection, populatedLink).subscribe(resp => {
      const resource = ResourceInstance.create(populatedLink, resp.content, resp.response.url);
      this.applyLinkResponseStrategy(populatedLink, resource);
    });
  }

  private applyLinkResponseStrategy(populatedLink: PopulatedLink, resource: ResourceInstance) {

    // Determine if the link meets the criteria for a link that refreshes the current resource.
    if (populatedLink.method === 'GET' && populatedLink.relName === 'self') {
      if (this.isRootResourceSelected) {
        this.selectedRootResource.instance = resource.instance;
      }
      this.currentResource.instance = resource.instance;
      return;
    }

    // If the currently selected resource is the root-resource and is being deleted, close it and notify the user.
    if (populatedLink.method === 'DELETE' && this.isRootResourceSelected) {
      this.closeSelectedResource();
      return;
    }

    // If the currently selected resource is an embedded resource, remove it from parent's list of embedded items.
    if (populatedLink.method === 'DELETE' && this.parentEmbeddedItems) {
      _.remove(this.parentEmbeddedItems, ei => ei.instance === this.selectedEmbeddedResource);

      this.selectedRootResource.childrenResources.pop();

      // Since the embedded resource was popped off of the array, the current item will be
      // the parent resource that contained the embedded resource.
      const embeddedItem = this.currentResource.instance._embedded[this.selectedEmbeddedResourceName];
      if (Array.isArray(embeddedItem)) {
        const embeddedColl = embeddedItem as IHalResource[];

        _.remove(embeddedColl, i => i === this.selectedEmbeddedResource.instance);
        if (embeddedColl.length === 0) {
          delete this.currentResource.instance._embedded[this.selectedEmbeddedResourceName];
        }
      } else {
        delete this.currentResource.instance._embedded[this.selectedEmbeddedResourceName];
      }

      this.selectedEmbeddedResource = null;
      return;
    }

    if (populatedLink.method === 'GET') {
      this.selectedRootResource.childrenResources.push(resource);
    }
  }

  // ----------------------------------------------------------------------------------
  // --- Root Resource Actions
  // ----------------------------------------------------------------------------------

  // Associates the root-resource with the current connection and navigates
  // to the resources-view to display details.
  public viewRootResource(rootResource: ResourceInstance) {

    this.parentEmbeddedItems = null;
    this.selectedEmbeddedResource = null;

    this.connectionRootResources.push(rootResource);
    this.selectedRootResource = rootResource;
    this.connectionRootResourceMap.set(this.selectedConnection.id, this.connectionRootResources);

    this.resourceService.saveOpenedResources(this.connectionRootResourceMap);
    this.router.navigateByUrl('areas/hal/resources').then(() => {});
  }

  // Navigates to the view that displays the selected root resource's errors.
  public viewRootResourceErrors() {
    this.router.navigateByUrl('areas/hal/errors').then(() => {});
  }

  // Clears the selected root resource errors and navigates back.
  public clearRootResourceErrors() {
    this.selectedRootResource.responseErrors.length = 0;
    this.router.navigateByUrl('areas/hal/resources').then(() => {});
  }

  // Selects a different root-resource from the currently selected connection.
  public changeRootResource(rootResource: ResourceInstance) {
    this.selectedRootResource = rootResource;
    this.currentResource.useJsonAsContentEnabled = false;

    this.parentEmbeddedItems = null;
    this.selectedEmbeddedResource = null;

    // When new resources are loaded, their corresponding URL is saved to local storage.
    // If the user reloads the browser or starts new application session, these URLs are
    // restored but the corresponding resource is not loaded until selected.
    if (this.selectedRootResource.instance === null) {
      this.resourceService.setResource(this.selectedConnection, this.selectedRootResource);
    }
  }

  // Un associates the currently selected resource with the connection.
  public closeSelectedResource() {
    _.remove(this.connectionRootResources, r => r === this.selectedRootResource);

    this.selectedRootResource = null;
    this.resourceService.saveOpenedResources(this.connectionRootResourceMap);
  }

  public closeAllResources() {
    this.connectionRootResources.length = 0;
    this.selectedRootResource = null;
    this.resourceService.saveOpenedResources(this.connectionRootResourceMap);
  }

  // ----------------------------------------------------------------------------------
  // --- Connection Actions
  // ----------------------------------------------------------------------------------

  // Updates the currently selected connection for which loaded root-resources should be listed.
  public changeConnection(connection: ApiConnection) {

    this.selectedConnection = connection;
    this.connectionRootResources = this.connectionRootResourceMap.get(connection.id) || [];
    this.selectedRootResource = null;

    // Load the entry resources for the selected connection:
    this.connectionService.getEntryResource(connection).subscribe(result => {
      this.selectedConnEntry = result;
      this.entryResourceUpdated.next(result);
    });
  }

  // ----------------------------------------------------------------------------------
  // --- Related Resource Actions
  // ----------------------------------------------------------------------------------

  // Only a singled embedded resource (or single resource within an embedded collection) can
  // be viewed at once.  Selecting a new embedded resource clears the prior one selected.
  public viewEmbeddedResource(name: string, parentEmbeddedItems: EmbeddedItem[], resource: ResourceInstance) {
    if (this.selectedEmbeddedResource) {
      _.remove(this.selectedRootResource.childrenResources,
          item => item === this.selectedEmbeddedResource);
    }

    this.parentEmbeddedItems = parentEmbeddedItems;
    this.selectedEmbeddedResourceName = name;
    this.selectedEmbeddedResource = resource;
    this.selectedRootResource.childrenResources.push(resource);
  }

  // Determines if the specified resource can be set as the current resource.
  // Setting the current resource clears all loaded child resources up to the
  // newly selected current resource.
  public isSetAsCurrentEnabled(resource: ResourceInstance): boolean {
    const childResources = this.selectedRootResource.childrenResources;
    const childIdx = childResources.indexOf(resource);

    // The last loaded child can't be made the current since the
    // last loaded child resource is the current resource.
    if (childIdx !== -1 && childIdx !== childResources.length - 1) {
      return true; // Not the lastly loaded child.
    }

    return childResources.length > 0 &&
      this.selectedRootResource.instance === resource.instance;

    // return childResources.length > 0 && this.isRootResourceSelected;
  }

  // Set the specified resource as the current.
  public setAsCurrent(resource: ResourceInstance) {
    const childResources = this.selectedRootResource.childrenResources;

    // If the root resource is being set as the current, clear any
    // loaded children resources.
    if (this.selectedRootResource.instance === resource.instance) {
      childResources.length = 0;
      return;
    }

    childResources.length = childResources.indexOf(resource) + 1;
  }
}
