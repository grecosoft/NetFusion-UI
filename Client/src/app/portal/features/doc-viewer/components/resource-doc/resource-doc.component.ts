import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiPropertyDoc, ApiResourceDoc} from '../../types/doc-types';

@Component({
  selector: 'app-resource-doc',
  templateUrl: './resource-doc.component.html',
  styleUrls: ['./resource-doc.component.scss']
})
export class ResourceDocComponent implements OnInit {

  @Input('resourceDoc')
  public resourceDoc: ApiResourceDoc;

  @Output('onChildObjSelected')
  public onChildObjSelected = new EventEmitter<ApiResourceDoc>();

  public propColumns = ['name', 'type', 'array', 'required', 'description'];
  public relationColumns = ['name', 'method', 'href', 'description'];

  public onObjectTypeSelected(propDoc: ApiPropertyDoc) {
    console.log(propDoc);
    this.onChildObjSelected.emit(propDoc.resourceDoc);
  }

  ngOnInit(): void {

  }
}
