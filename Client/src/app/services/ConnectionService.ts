import * as shortid from 'shortid';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService } from 'src/app/services/LocalStorageService';
import {ApiConnection, ConnectionDeletedEvent} from '../types/connection-types';
import {RequestClientFactory } from 'src/app/common/client/RequestClientFactory';
import {IHalEntryPointResource} from 'src/app/common/client/Resource';
import {EventBusService} from './EventBusService';
import {AlertEvent} from '../types/eventBus-types';

// Service responsible for managing connections to HAL based REST APIs and
// for returning entry-point resources.
@Injectable()
export class ConnectionService {

    private storageKey = 'hal-viewer:connections';
    private apiConnections: ApiConnection[];

    constructor(
        private eventBus: EventBusService,
        private localStorage: LocalStorageService,
        private clientFactory: RequestClientFactory,
        private httpClient: HttpClient) {
    }

    // Loads the connection settings from local storage and creates the
    // corresponding client that will be used to make calls.
    public loadConnections() {
        this.apiConnections = this.localStorage.getValue<ApiConnection[]>(this.storageKey) || [];

        for (const conn of this.apiConnections) {
             conn.succeeded = null;
             this.clientFactory.createClient(conn.id, conn.address);
        }
    }

    private storeConnections() {
        this.localStorage.saveValue(this.storageKey, this.apiConnections);
    }

    public get connections(): ApiConnection[] {
        return this.apiConnections;
    }

    public getConnection(connId: string): ApiConnection {
        return this.connections.find((c, _) => c.id === connId);
    }

    // Save the updated connection to local storage and re-creates the associated
    // client used to make calls.
    public saveConnection(connection: ApiConnection) {

        if (!connection.id) {
            connection.id = shortid.generate();
            this.apiConnections.push(connection);
        }

        this.clientFactory.createClient(connection.id, connection.address);
        this.storeConnections();
    }

    // Deletes the specified connection and updates the local storage.
    // Also removes the associated client used to make calls.
    public deleteConnection(connection: ApiConnection) {
        const idx = this.apiConnections.indexOf(connection);
        if (idx > -1) {
            this.apiConnections.splice(idx, 1);
        }

        this.clientFactory.removeClient(connection.id);
        this.storeConnections();

        this.publishDeleteEvents(connection);
    }

  // Publish event so other services and components can preform any
  // needed application logic required when a connection is deleted.
    private publishDeleteEvents(connection: ApiConnection) {
      const event = ConnectionDeletedEvent.withConnectionNamed(connection);
      this.eventBus.publish(event);

      const alertEvt = AlertEvent.withMessage(`Connection Named: ${connection.name} deleted.`);
      this.eventBus.publish(alertEvt);
    }

    // Returns the entry resource associated with a connection.  The entry resource
    // contains little to no state but a set of URLs from which communication with
    // the API can begin.  These links are often template based.
    public getEntryResource(connection: ApiConnection): Observable<IHalEntryPointResource> {

        return this.clientFactory.getEntryPointResource(connection.id, connection.entryPath);
    }

    // Checks if all connections are correct by connecting to the server.
    public testConnections() {
        for (const conn of this.apiConnections) {
            this.testConnection(conn);
        }
    }

    // Checks connection by attempting to load it associated entry point resource.
    public testConnection(conn: ApiConnection) {
      conn.succeeded = false;
      this.httpClient.get(`${conn.address}/${conn.entryPath}`, { observe: 'response' })
        .subscribe(resp => {
          conn.succeeded = resp.status === 200;
        });
    }
}
