import {Component, OnInit} from '@angular/core';
import {HalApplication} from '../../../hal-viewer/services/HalApplication';
import {ApiActionDocService} from '../../services/ApiActionDocService';

@Component({
  selector: 'app-action-doc',
  templateUrl: './action-doc.component.html',
  styleUrls: ['./action-doc.component.scss']
})
export class ActionDocComponent implements OnInit {

  constructor(
    private docService: ApiActionDocService) {
  }

  public ngOnInit(): void {

    console.log('component')
    this.docService.LoadApiActionDoc('api/hardware/locations/company/{id}');

  }
}
