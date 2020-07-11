import {Injectable} from '@angular/core';
import {ApiActionDocService} from './ApiActionDocService';
import {ApiActionDoc} from '../types/doc-types';
import {ApiConnection} from '../../../../types/connection-types';
import {Link} from 'src/app/common/client/Resource';
import {PopulatedLink} from '../../hal-viewer/types/link-types';

// Application service exposing action documentation needed logic.
@Injectable()
export class DocApplication {

  public actionDoc: ApiActionDoc;

  constructor(
    private docService: ApiActionDocService) {
  }

  public loadActionDocs(connection: ApiConnection, link: Link) {
    this.docService.LoadApiActionDoc(connection, link);
  }
}
