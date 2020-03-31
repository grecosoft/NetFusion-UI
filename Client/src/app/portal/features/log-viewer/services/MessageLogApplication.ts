import {Injectable} from '@angular/core';
import {ConnectionService} from '../../../../services/ConnectionService';
import {MessageLogService} from './MessageLogService';
import {ApiConnection} from '../../../../types/connection-types';
import {MessageLog} from '../types/message-log-types';

@Injectable()
export class MessageLogApplication {

  constructor(
    private logMessageService: MessageLogService,
    private connectionService: ConnectionService) {

  }

  // The currently configured connections.
  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
  }

  public get selectedConnectionLogs(): MessageLog[] {
    return this.logMessageService.currentLogs;
  }

  public startReceiving(connection: ApiConnection) {
    this.logMessageService.startReceivingOn(connection);
  }

  public stopReceiving(connection: ApiConnection) {
    this.logMessageService.stopReceivingOn(connection);
  }
}
