import { Injectable } from '@angular/core';
import { LocalStorageService } from './LocalStorageService';
import { EventBusService } from './EventBusService';
import { PortalSettings } from '../types/settings-types';
import { SettingsUpdatedEvent } from '../portal/events/SettingsUpdatedEvent';

@Injectable()
export class PortalSettingsService {

    constructor(
        private eventBus: EventBusService,
        private localStorage: LocalStorageService) {

    }

    public updateSettings(settings: PortalSettings) {
        this.localStorage.saveValue('portal-settings', settings);

        const updateEvent = new SettingsUpdatedEvent(settings);
        this.eventBus.publish(updateEvent);
    }

    public getSettings(): PortalSettings {
        let settings =  this.localStorage.getValue<PortalSettings>('portal-settings');
        if (settings === undefined) {
          settings = { selectedThemeClassName: 'teal-app-theme'};
          this.updateSettings(settings);
        }
        return settings;
    }
}
