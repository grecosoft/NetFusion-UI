import {ResourceInstance} from '../portal/features/hal-viewer/types/resource-types';
import {IHalResource} from '../common/client/Resource';

export class SelectionItem {
  key?: string;
  objKey?: any;
  displayValue: string;
}

// Adds additional information to an embedded resource.
export class EmbeddedItem {
  public name: string;
  public instance: ResourceInstance;
  public isArray: boolean;

  public getEmbeddedCollInstances(): EmbeddedItem[] {
    if (!this.isArray) {
      return [];
    }

    const embeddedColl = this.instance.instance as unknown as any[];

    return embeddedColl.map((resource: IHalResource, idx: number) => {
      const collItem = new EmbeddedItem();
      collItem.name = `Item[${idx}]`;
      collItem.instance =  ResourceInstance.createForEmbedded(resource);

      return collItem;
    });
  }
}
