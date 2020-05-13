import {IHalResource} from 'src/app/common/client/Resource';
import {PopulatedLink} from './link-types';
import {ErrorResponseInfo} from 'src/app/common/client/ErrorResponseInfo';

export class ResourceInstance {
  public link: PopulatedLink = null;
  public instance: IHalResource = null;
  public resourceUrl: string = null;

  public loadOnRestoreFailed?: boolean;
  public loadOnRestoreMessage?: string;

  public childrenResources: ResourceInstance[] = [];
  public useJsonAsContentEnabled: boolean;
  public responseErrors: ErrorResponseInfo[] = [];

  public static create(link: PopulatedLink, instance: IHalResource, resourceUrl: string): ResourceInstance {
    const obj = new ResourceInstance();

    obj.link = link;
    obj.instance = instance;
    obj.resourceUrl = resourceUrl;

    return obj;
  }

  public get hasDetails(): boolean {
    return this.instance.hasOwnProperty('_links') || this.instance.hasOwnProperty('_embedded');
  }

  public static createForEmbedded(instance: IHalResource): ResourceInstance {
    const obj = new ResourceInstance();

    obj.instance = instance;

    return obj;
  }

  public static createForUrl(resourceUrl: string): ResourceInstance {
    const obj = new ResourceInstance();
    obj.resourceUrl = resourceUrl;

    return obj;
  }
}

export class OpenedResourceStore {
  public resources: SavedResource[] = [];
}

export class SavedResource {
  public connectionId: string;
  public rootResourceUrl: string;
}
