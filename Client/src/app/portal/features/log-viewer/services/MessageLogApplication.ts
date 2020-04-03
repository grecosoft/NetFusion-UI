import {Injectable} from '@angular/core';
import {ConnectionService} from '../../../../services/ConnectionService';
import {MessageLogService} from './MessageLogService';
import {ApiConnection} from '../../../../types/connection-types';
import {MessageLog} from '../types/message-log-types';
import {SelectionItem} from '../../../../types/common-types';
import * as _ from 'lodash';

@Injectable()
export class MessageLogApplication {

  private currentSortKey: string;

  constructor(
    private logMessageService: MessageLogService,
    private connectionService: ConnectionService) {
  }

  // The currently configured connections.
  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
  }

  public setCurrentSort(sort: SelectionItem) {
    this.currentSortKey = sort.key;
  }

  public get selectedConnectionLogs(): MessageLog[] {

    if (this.currentSortKey === 'date-occurred') {
      return _.orderBy(this.logMessageService.currentLogs,
        m => m.dateOccurred, 'desc' );
    }

    if (this.currentSortKey === 'correlation-id') {
      return _.orderBy(this.logMessageService.currentLogs,
        m => m.correlationId, 'desc' );
    }

    return this.logMessageService.currentLogs;

  }

  public startReceiving(connections: ApiConnection[]) {
    this.logMessageService.startConnections(connections);
  }

  public stopReceiving(connection: ApiConnection) {
    this.logMessageService.stopReceivingOn(connection);
  }
}
