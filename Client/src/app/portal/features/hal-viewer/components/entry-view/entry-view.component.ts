import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {IHalEntryPointResource, IHalResource} from 'src/app/common/client/Resource';
import {ApiConnection} from 'src/app/types/connection-types';
import {ResourceInstance} from '../../types/resource-types';
import {PopulatedLink} from '../../types/link-types';
import {HalApplication} from '../../services/HalApplication';

// Presents a list of entry resources associated with the selected connection.
// A service API entry resource can also have embedded child entry resources
// to provide better organization.
@Component({
    selector: 'entry-view',
    templateUrl: './entry-view.component.html',
    styleUrls: ['./entry-view.component.scss']
})
export class EntryViewComponent implements OnInit {

  // The currently selected connection and root entry resource  of the service API.
  private rootEntry: IHalEntryPointResource;
  private entryResourceMap = new Map<string, IHalResource>();

  // The currently selected entry-resource associated with the selected connection.
  public selectedEntry: IHalResource;
  public selectedEntryName: string;

  // The loaded resource associated with the executed entry-resource link.
  public rootResource: ResourceInstance;

  constructor(
      public application: HalApplication) {
  }

  public ngOnInit() {

      this.subscriptions();
  }

  private subscriptions() {

    this.application.whenConnectionEntryUpdated.subscribe(connEntry => {
      this.rootEntry = connEntry;
      this.buildEntryMap('entry', connEntry);
    });

    this.application.whenRootResourceLoaded.subscribe(rootResource => {
        this.rootResource = rootResource;
    });
  }

  public onConnectionSelected(connection: ApiConnection) {
    this.application.changeConnection(connection);
    this.selectedEntryName = null;
  }

  public onEntrySelected(entryName: string) {
    this.selectedEntry = this.entryResourceMap.get(entryName);
    this.selectedEntryName = ' - ' + entryName;
  }

  // Returns the list paths to each each entry resource for selection.
  public get entryNames(): string[] {
      return Array.from(this.entryResourceMap.keys());
  }

  // Crates a map by recursively iterating over the entry resource and its embedded children.
  private buildEntryMap(name: string, resource: IHalResource) {
      this.entryResourceMap.set(name, resource);

      if (resource._embedded) {
          _.forOwn(resource._embedded, (childResource: IHalResource, childName: string) => {
              this.buildEntryMap(`${name}/${childName}`, childResource);
          });
      }
  }

  // Displays the root resources.
  public onLinkSelected(populatedLink: PopulatedLink) {

      this.application.loadRootResource(populatedLink);
  }

  // Allows navigation to the resource's details allowing link
  // navigation and viewing of embedded resources.
  public onViewDetails() {
      this.application.viewRootResource(this.rootResource);
  }
}
