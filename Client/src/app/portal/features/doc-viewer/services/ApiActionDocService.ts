import {Injectable} from '@angular/core';
import {RequestClientFactory} from '../../../../common/client/RequestClientFactory';
import { HttpClient } from '@angular/common/http';
import {ApiRequest} from '../../../../common/client/Request';

@Injectable()
export class ApiActionDocService {

  constructor(
    private httpClient: HttpClient,
    private clientFactory: RequestClientFactory) {

  }

  public LoadApiActionDoc(actionTemplate: string) {

    // const client = this.clientFactory.getClient(connection.id);


    this.httpClient.get('http://localhost:6400/api/net-fusion/rest?doc=api/hardware/locations/company/{id}')
      .subscribe(response => {
        console.log(response);
      });
  }

}
