import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiRelationDoc, ApiResourceDoc} from '../../types/doc-types';

@Component({
  selector: 'app-resource-doc',
  templateUrl: './resource-doc.component.html',
  styleUrls: ['./resource-doc.component.scss']
})
export class ResourceDocComponent {

  @Input('resourceDoc')
  public resourceDoc: ApiResourceDoc;

  @Output('onChildResourceSelected')
  public onChildResourceSelected = new EventEmitter<ApiResourceDoc>();

  @Output('onRelationSelected')
  public onChildRelationSelected = new EventEmitter<ApiRelationDoc>();

  public propColumns = ['name', 'type', 'array', 'required', 'description'];
  public relationColumns = ['name', 'method', 'href', 'description'];
  public embeddedColumns = ['embeddedName', 'isCollection', 'resourceDoc'];

  public onResourceSelected(resourceDoc: ApiResourceDoc) {
    this.onChildResourceSelected.emit(resourceDoc);
  }

  public onRelationSelected(relationDoc: ApiRelationDoc) {
    this.onChildRelationSelected.emit(relationDoc);
  }

}
