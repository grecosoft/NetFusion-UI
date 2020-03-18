import { PortalSettings } from './settings-types';

// Represents an event that can be published and received by subscribers.
export abstract class EventBase {

    // Unique value representing the event.
    public abstract get eventKey(): string;
}

// Event that is raised by components and services to alert the user.
export class AlertEvent extends EventBase {

    public message: string;
    public durationInSections = 4;

    public get eventKey(): string {
        return 'events.alert';
    }

    public static get key(): AlertEvent {
        return new AlertEvent();
    }

    public static withMessage(message: string, durationInSeconds: number = 4) {
        const instance = new AlertEvent();
        instance.message = message;
        instance.durationInSections = durationInSeconds;

        return instance;
    }
}

// Event that is raised when the portal settings are updated.
export class SettingsUpdatedEvent extends EventBase {

    public settings: PortalSettings;

    constructor(settings?: PortalSettings) {
        super();
        this.settings = settings;
    }

    public get eventKey(): string {
        return 'events.settings.updated';
    }

    public static get key(): SettingsUpdatedEvent {
        return new SettingsUpdatedEvent();
    }
}
