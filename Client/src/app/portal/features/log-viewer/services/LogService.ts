import {Observable, Subject} from 'rxjs';
import {CompositeLog} from '../types/log-types';
import {Injectable} from '@angular/core';
import {ApiConnection} from 'src/app/types/connection-types';
import {RequestClientFactory} from 'src/app/common/client/RequestClientFactory';
import {ApiRequest} from 'src/app/common/client/Request';

@Injectable()
export class LogService {

  private logReceivedSubject = new Subject<CompositeLog>();

  constructor(
    private clientFactory: RequestClientFactory) {
  }

  public get whenLogReceived(): Observable<CompositeLog> {
    return this.logReceivedSubject.asObservable();
  }

  public readCompositeLog(connection: ApiConnection) {

    const client = this.clientFactory.getClient(connection.id);
    const request = ApiRequest.get(connection.logPath);

    client.send<any>(request).subscribe(response => {
      this.logReceivedSubject.next(response.content);
    });
  }
}
