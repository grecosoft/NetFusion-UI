import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventBusService } from './EventBusService';
import {AlertEvent} from '../portal/events/AlertEvent';


@Injectable()
export class AlertService {
    constructor(
        private eventBus: EventBusService,
        private snackBar: MatSnackBar) {

        this.eventBus.subscribe<AlertEvent>(AlertEvent.key)
            .subscribe(alert => {

                this.snackBar.open(
                    alert.message, null,
                    { duration: alert.durationInSections * 1000 });
            });
    }

}
