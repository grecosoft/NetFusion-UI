import * as signalR from '@microsoft/signalr';
import {Observable, Subject} from 'rxjs';
import {MessageLog} from '../types/message-log-types';
import {ApiConnection} from '../../../../types/connection-types';
import {ConnectionService} from '../../../../services/ConnectionService';
import {Injectable} from '@angular/core';

@Injectable()
export class MessageLogService {

  private messageLogSubject = new Subject<MessageLog>();
  private signalRConnections = new Map<ApiConnection, signalR.HubConnection>();
  private connectionLogs = new Map<ApiConnection, MessageLog[]>();

  constructor(
    private connectionService: ConnectionService) {

  }

  public get whenMessageReceived(): Observable<MessageLog> {
    return this.messageLogSubject.asObservable();
  }

  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
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
      messageLog.receivedOnConnection = connection;

      this.recordConnectionLog(connection, messageLog);
      this.messageLogSubject.next(messageLog);
    });

    signalRConn.start().then();
  }

  public stopReceivingOn(connection: ApiConnection) {
    const signalRConn = this.signalRConnections.get(connection);

    if (signalRConn !== null) {
      signalRConn.stop().then();
    }
  }

  private recordConnectionLog(connection: ApiConnection, messageLog: MessageLog) {
    console.log(connection, messageLog);
  }
}
