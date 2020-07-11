// Event that is raised by components and services to alert the user.
import {EventBase} from '../../types/eventBus-types';

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
