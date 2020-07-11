import {Component} from '@angular/core';
import {LogApplication} from '../../services/LogApplication';
import {CompositePlugin} from '../../types/log-types';

@Component({
    selector: 'app-log-dashboard',
    templateUrl: './composite-log.component.html',
    styleUrls: [ './composite-log.component.scss' ]
})
export class CompositeLogComponent {

    constructor(
        public application: LogApplication) {

    }

    public selectedAppPlugin: CompositePlugin;
    public selectedCorePlugin: CompositePlugin;
}
