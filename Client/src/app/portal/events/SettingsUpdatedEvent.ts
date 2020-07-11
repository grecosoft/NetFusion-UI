import {EventBase} from '../../types/eventBus-types'
import {PortalSettings} from '../../types/settings-types';

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
