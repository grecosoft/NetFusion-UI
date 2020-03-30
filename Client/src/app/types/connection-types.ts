
// Models a connection to a REST/HAL base server Web Api.
import {EventBase} from 'src/app/types/eventBus-types';

export class ApiConnection {
    public id: string;
    public name: string;
    public address: string;
    public entryPath: string;
    public logPath: string;
    public succeeded?: boolean;

    public static AppendAddressToPath(connection: ApiConnection, path: string) {
      if (connection.address.endsWith('/') || path.startsWith('/')) {
        return `${connection.address}${path}`;
      }

      return `${connection.address}/${path}`;
    }
}

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
