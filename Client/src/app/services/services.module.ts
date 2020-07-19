import { NgModule } from '@angular/core';
import { AlertService } from './AlertService';
import { EventBusService } from './EventBusService';
import { LocalStorageService } from './LocalStorageService';
import { PortalService } from './PortalService';
import { PortalSettingsService } from './PortalSettingsService';
import { PortalApplication } from './PortalApplication';
import {ConnectionService} from './ConnectionService';
import {ClipboardService} from './ClipboardService';

@NgModule({
    providers: [
        PortalApplication,
        AlertService,
        EventBusService,
        LocalStorageService,
        PortalService,
        PortalSettingsService,
        ConnectionService,
        ClipboardService
    ]
})
export class ServicesModule {

}
