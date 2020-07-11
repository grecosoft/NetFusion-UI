import * as _ from 'lodash';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceInstance} from '../../types/resource-types';
import {HalApplication} from '../../services/HalApplication';
import {IHalResource} from 'src/app/common/client/Resource';
import {EmbeddedItem} from '../../../../../types/common-types';

// Component allowing navigation of a root resource to related
// linked resources and embedded resources and resource collections.
@Component({
    selector: 'app-resource-view',
    templateUrl: './resource-view.component.html',
    styleUrls: [ './resource-view.component.scss' ]
})
export class ResourceViewComponent implements OnInit {

  // The resource to be viewed.
  @Input('resource')
  public resource: ResourceInstance;

  // Raised when action is taken to obtain the resources as JSON.
  @Output('json-content')
  public jsonContent = new EventEmitter<string>();

  // List of embedded items associated with the resource and the currently selected item.
  public embeddedItems: EmbeddedItem[] = [];
  public selectedEmbeddedItem;

  // If the selected embedded item is a resource collection, the list of resources within
  // the collection and the currently selected item within the collection.
  public embeddedCollItems: EmbeddedItem[] = [];
  public selectedEmbeddedCollItem;

  constructor(
    public application: HalApplication) {

  }

  public ngOnInit(): void {
    this.setEmbeddedItems();
  }

  // Determines if there embedded items and converts each one into an EmbeddedItem model.
  private setEmbeddedItems() {
    if (! this.resource.instance._embedded) {
      return;
    }

    // Embedded items are a key/value pair of associated resources that
    // are loaded with the parent resource.
    _.forOwn(this.resource.instance._embedded, (value, name) => {
      const embeddedItem = new EmbeddedItem();

      // Add metadata used by the presentation:
      embeddedItem.name = name;
      embeddedItem.instance = ResourceInstance.createForEmbedded(value);
      embeddedItem.isArray = Array.isArray(value);

      this.embeddedItems.push(embeddedItem);
    });
  }

  // Sets the resource associated with the component as being current.
  // This results in all subsequent loaded resources being cleared.
  public setAsCurrent() {
    this.application.setAsCurrent(this.resource);
    this.selectedEmbeddedItem = null;
    this.selectedEmbeddedCollItem = null;
  }

  // Determine if the resource associated with the component can be made current.
  public isSetAsCurrentEnabled(): boolean {
    return this.application.isSetAsCurrentEnabled(this.resource);
  }

  // Raises event with the content of the resource serialized as json.
  public setAsContent(resource: IHalResource) {
    this.jsonContent.next(JSON.stringify(resource.model));
  }

  public get isCurrentResource(): boolean {
    return this.application.isCurrentResource(this.resource);
  }

  // Called when a selected embedded resource, loaded with the parent resource has
  // been selected.  This can be either a single resource or a collection of resources.
  public onEmbeddedItemSelected(item: EmbeddedItem) {

    // Embedded collection of resources selected:
    if (item.isArray) {
      this.embeddedCollItems = item.getEmbeddedCollInstances();

      // Select first item in the collection:
      if (this.embeddedCollItems.length > 0) {
        this.onEmbeddedCollItemSelected(this.embeddedCollItems[0]);
      }

      return;
    }

    // Single resource selected.
    this.embeddedCollItems = [];
    this.selectedEmbeddedCollItem = null;
    this.application.viewEmbeddedResource(item.name, this.embeddedItems, item.instance);
  }

  // Called when resource within collection is selected:
  public onEmbeddedCollItemSelected(item: EmbeddedItem) {
    this.selectedEmbeddedCollItem = item;
    this.application.viewEmbeddedResource(this.selectedEmbeddedItem.name, this.embeddedCollItems, item.instance);
  }
}



