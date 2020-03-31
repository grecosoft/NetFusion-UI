import * as signalR from '@microsoft/signalr';
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

  public startReceivingOn(connection: ApiConnection) {
    let signalRConn = this.signalRConnections.get(connection);

    if (signalRConn === undefined) {
      signalRConn = new signalR.HubConnectionBuilder()
        .withUrl(ApiConnection.AppendAddressToPath(connection, '/api/message/log'))
        .build();

      this.signalRConnections.set(connection, signalRConn);
    }

    signalRConn.on('LogMessage', (messageLog: MessageLog) => {
      this.recordConnectionLog(connection, messageLog);
    });

    signalRConn.start().then();
  }

  public stopReceivingOn(connection: ApiConnection) {
    const signalRConn = this.signalRConnections.get(connection);

    if (signalRConn !== null) {
      signalRConn.stop().then();
      this.signalRConnections.delete(connection);
      this.connectionLogs.delete(connection);
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
