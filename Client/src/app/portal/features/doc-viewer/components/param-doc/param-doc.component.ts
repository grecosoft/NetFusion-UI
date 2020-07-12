import {Component, Input} from '@angular/core';
import {ApiParameterDoc} from '../../types/doc-types';

@Component({
  selector: 'app-param-doc',
  templateUrl: './param-doc.component.html',
  styleUrls: ['./param-doc.component.scss']
})
export class ParamDocComponent {

  @Input('param-list')
  public parameters: ApiParameterDoc[];

  public paramColumns = ['name', 'type', 'defaultValue', 'optional', 'description'];
}
