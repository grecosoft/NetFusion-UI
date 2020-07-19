import {Injectable} from '@angular/core';
import {RequestClientFactory} from '../../../../common/client/RequestClientFactory';

import {ApiRequest} from '../../../../common/client/Request';
import {RequestSettings} from '../../../../common/client/Settings';
import {ApiConnection} from '../../../../types/connection-types';
import {Link} from '../../../../common/client/Resource';
import {ApiActionDoc} from '../types/doc-types';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';



@Injectable()
export class ApiActionDocService {

  constructor(
    private httpClient: HttpClient,
    private clientFactory: RequestClientFactory) {

  }

  public LoadApiActionDoc(connection: ApiConnection, link: Link): Observable<ApiActionDoc> {

    const client = this.clientFactory.getClient(connection.id);

    const request = ApiRequest.get(connection.docPath, config => {
      config.settings = RequestSettings.create(s => {
          s.queryString.addParam('method', link.methods[0]);
          s.queryString.addParam('doc', link.docQuery);
      });
    });

    return client.send<ApiActionDoc>(request).pipe(
      map(resp => resp.content)
    );
  }

  public LoadResourceCode(connection: ApiConnection, resourceName: string): Observable<string> {

    return this.httpClient.get(`http://localhost:6400/api/net-fusion/rest?resource=${resourceName}`,
      { responseType: 'text'});
  }
}
