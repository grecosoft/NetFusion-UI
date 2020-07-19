
// Models a connection to a REST/HAL base server Web Api.
import {EventBase} from 'src/app/types/eventBus-types';

export class ApiConnection {
    public id: string;
    public name: string;
    public address: string;
    public entryPath: string;
    public logPath: string;
    public docPath: string;
    public succeeded?: boolean;

    public static AppendAddressToPath(connection: ApiConnection, path: string) {
      if (connection.address.endsWith('/') || path.startsWith('/')) {
        return `${connection.address}${path}`;
      }

      return `${connection.address}/${path}`;
    }
}


