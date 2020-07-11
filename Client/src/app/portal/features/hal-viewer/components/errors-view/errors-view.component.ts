import {Component, OnInit} from '@angular/core';
import {ErrorResponseInfo} from 'src/app/common/client/ErrorResponseInfo';
import {HalApplication} from '../../services/HalApplication';

// Displays a list of errors for the current selected
// root resource.
@Component({
    selector: 'app-error-view',
    templateUrl: './errors-view.component.html',
    styleUrls: ['./errors-view.component.scss']
})
export class ErrorsViewComponent implements OnInit {

    public resourceCaption: string;
    public responseErrors: ErrorResponseInfo[];

    constructor(
        private application: HalApplication) {

    }

    public ngOnInit() {
      const resource = this.application.selectedRootResource;

      if (resource) {
        this.resourceCaption = resource.resourceUrl;
        this.responseErrors = resource.responseErrors;
      }
    }

    public onClearErrors() {
      this.application.clearRootResourceErrors();
    }
}
