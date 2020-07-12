import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiConnection} from 'src/app/types/connection-types';
import {PopulatedLink} from '../types/link-types';
import {RequestClientFactory} from 'src/app/common/client/RequestClientFactory';
import {ApiRequest, ApiResponse} from 'src/app/common/client/Request';
import {IHalResource} from 'src/app/common/client/Resource';
import {OpenedResourceStore, ResourceInstance} from '../types/resource-types';
import {LocalStorageService} from '../../../../services/LocalStorageService';
import {RequestSettings} from '../../../../common/client/Settings';

// Service responsible for issuing resource requests to HAL based REST Api.
@Injectable()
export class ResourceService {

  constructor(
    private clientFactory: RequestClientFactory,
    private localStorage: LocalStorageService) {

  }

  // Reads a resources from the specified Api connection located at the specified link.
  public executeLink(connection: ApiConnection, populatedLink: PopulatedLink): Observable<ApiResponse<IHalResource>> {
    const client = this.clientFactory.getClient(connection.id);

    const request = ApiRequest.fromLink(populatedLink.link,
      (config) => {
        config.withRouteValues(populatedLink.linkParams || {});
        config.settings = RequestSettings.create(settings => {
          settings.headers.addHeader('include-url-for-doc-query', 'yes');
        });
    });

    if (populatedLink.content) {
      request.withContent(populatedLink.content);
    }

    return client.send<IHalResource>(request);
  }

  // Saves the URL of all root resources.  The URLs are used when the browser
  // is reloaded or when a new browser session is started.
  public saveOpenedResources(connResources: Map<string, ResourceInstance[]>) {
    const store = new OpenedResourceStore();

    connResources.forEach((resources, connId) => {
      resources.forEach((r, _) => {


        store.resources.push({ connectionId: connId, populatedLink: r.link, rootResourceUrl: r.resourceUrl});
      });
    });

    this.localStorage.saveValue('hal-viewer:resources', store);
  }

  // Populates the mapping storing the connection on which resources were opened.
  // The actual call to load the resource is not completed but the storage of the
  // minimal needed information required to load resource when selected.
  public restoreOpenedResource(connResources: Map<string, ResourceInstance[]>) {
    const store = this.localStorage.getValue<OpenedResourceStore>('hal-viewer:resources');

    if (store === undefined || store.resources === null) {
      return;
    }

    store.resources.forEach((sr, _) => {
      const resources = connResources.get(sr.connectionId) || [];
      resources.push(ResourceInstance.createForUrl(sr.populatedLink, sr.rootResourceUrl));
      connResources.set(sr.connectionId, resources);
    });
  }

  // Called to load a previous loaded resource from this saved URL.
  public setResource(currConn: ApiConnection, resourceInstance: ResourceInstance) {
    const client = this.clientFactory.getClient(currConn.id);
    const apiRequest = ApiRequest.get(resourceInstance.resourceUrl);

    client.call(apiRequest).subscribe(result => {
      if (result.response.status === 200) {
        resourceInstance.instance = result.content;
        resourceInstance.loadOnRestoreFailed = false;
        resourceInstance.loadOnRestoreMessage = null;
      } else {
        resourceInstance.loadOnRestoreFailed = true;
        resourceInstance.loadOnRestoreMessage = `(${result.response.status})${result.response.statusText}`;
      }
    }, (error: HttpErrorResponse) => {
      resourceInstance.loadOnRestoreFailed = true;
      resourceInstance.loadOnRestoreMessage = `(${error.status})${error.statusText}`;
    });
  }
}

