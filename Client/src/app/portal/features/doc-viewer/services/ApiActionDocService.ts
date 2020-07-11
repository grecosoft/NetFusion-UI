import {Injectable} from '@angular/core';
import {RequestClientFactory} from '../../../../common/client/RequestClientFactory';
import {Observable, Subject} from 'rxjs';

import {ApiRequest} from '../../../../common/client/Request';
import {RequestSettings} from '../../../../common/client/Settings';
import {ApiConnection} from '../../../../types/connection-types';
import {Link} from '../../../../common/client/Resource';
import {ApiActionDoc} from '../types/doc-types';


@Injectable()
export class ApiActionDocService {

  private actionDocSubject = new Subject<ApiActionDoc>();

  constructor(
    private clientFactory: RequestClientFactory) {

  }

  public get whenActionDocLoaded(): Observable<ApiActionDoc>  {
    return this.actionDocSubject.asObservable();
  }

  public LoadApiActionDoc(connection: ApiConnection, link: Link) {

    const client = this.clientFactory.getClient(connection.id);

    const request = ApiRequest.get('api/net-fusion/rest', config => {
      config.settings = RequestSettings.create(s => s.queryString.addParam('doc', link.docQuery));
    });

    client.send<ApiActionDoc>(request).subscribe(response => {
      this.actionDocSubject.next(response.content);
    });
  }
}
