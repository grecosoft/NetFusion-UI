import {Component, Input} from '@angular/core';
import {ApiPropertyDoc, ApiRelationDoc, ApiResponseDoc} from '../../types/doc-types';

@Component({
  selector: 'app-resource-doc',
  templateUrl: './resource-doc.component.html',
  styleUrls: ['./resource-doc.component.scss']
})
export class ResourceDocComponent {

  @Input()
  public responseDoc: ApiResponseDoc;

  public get properties(): ApiPropertyDoc[] {
    return this.responseDoc.resourceDoc.properties;
  }

  public get relations(): ApiRelationDoc[] {
    return this.responseDoc.resourceDoc.relationDocs;
  }

  public propColumns = ['name', 'type', 'array', 'required', 'description'];
  public relationColumns = ['name', 'method', 'href', 'description'];

}
