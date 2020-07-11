import {EventBase} from '../../types/eventBus-types';
import {ApiConnection} from '../../types/connection-types';

export class ConnectionDeletedEvent extends EventBase {

  public connectionId: string;
  public connectionName: string;

  public get eventKey(): string {
    return 'events.features.hal-viewer.connection.deleted';
  }

  public static get key(): ConnectionDeletedEvent {
    return new ConnectionDeletedEvent();
  }

  public static withConnectionNamed(connection: ApiConnection) {
    const instance = new ConnectionDeletedEvent();
    instance.connectionId = connection.id;
    instance.connectionName = connection.name;

    return instance;
  }
}
