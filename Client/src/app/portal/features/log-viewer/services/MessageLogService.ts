import * as signalR from '@microsoft/signalr';
import {HubConnectionState} from '@microsoft/signalr';
import {MessageLog} from '../types/message-log-types';
import {ApiConnection} from '../../../../types/connection-types';
import {ConnectionService} from '../../../../services/ConnectionService';
import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class MessageLogService {

  private signalRConnections = new Map<ApiConnection, signalR.HubConnection>();
  private connectionLogs = new Map<ApiConnection, MessageLog[]>();

  constructor(
    private connectionService: ConnectionService) {

  }

  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
  }

  public get currentLogs(): MessageLog[] {
    return _.flatten(Array.from(this.connectionLogs.values()));
  }

  public startConnections(selectedConnections: ApiConnection[]) {
    for (const conn of this.connections) {
      if (selectedConnections.indexOf(conn) > -1) {
        this.startReceivingOn(conn);
      } else {
        this.stopReceivingOn(conn);
      }
    }
  }

  public startReceivingOn(connection: ApiConnection) {
    let signalRConn = this.signalRConnections.get(connection);

    if (signalRConn === undefined) {
      signalRConn = new signalR.HubConnectionBuilder()
        .withUrl(ApiConnection.AppendAddressToPath(connection, '/api/message/log'))
        .build();

      signalRConn.on('LogMessage', (messageLog: MessageLog) => {
        this.recordConnectionLog(connection, messageLog);
      });

      signalRConn.start().then();

      this.signalRConnections.set(connection, signalRConn);
    }
  }

  public stopReceivingOn(connection: ApiConnection) {
    const signalRConn = this.signalRConnections.get(connection);

    if (signalRConn !== undefined) {
      this.signalRConnections.delete(connection);
      this.connectionLogs.delete(connection);

      if (signalRConn.state === HubConnectionState.Connected) {
        signalRConn.stop().then();
      }
    }
  }

  private recordConnectionLog(connection: ApiConnection, messageLog: MessageLog) {
    let logs = this.connectionLogs.get(connection);

    if (logs === undefined) {
      logs = [];
    }

    messageLog.connectionName = connection.name;

    logs.push(messageLog);
    this.connectionLogs.set(connection, logs);
  }
}
