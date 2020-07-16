import {Injectable} from '@angular/core';

import * as _ from 'lodash';
import {map, take} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

import {ApiActionDocService} from './ApiActionDocService';
import {ActionDocState} from '../types/app-types';
import {ApiConnection} from '../../../../types/connection-types';
import {ApiActionDoc} from '../types/doc-types';
import {SelectionItem} from '../../../../types/common-types';
import {Link} from '../../../../common/client/Resource';
import {ConnectionService} from '../../../../services/ConnectionService';


// Application service exposing action documentation needed logic.
@Injectable()
export class DocApplication {

  // Map between a connection and its list of loaded action documents.
  private connectionDocs = new Map<string, ActionDocState[]>();

  // The currently loaded connection and its associated action documents.
  public selectedConnection: ApiConnection = null;
  public selectedActionDocState: ActionDocState = null;
  private connectionActionDocs: ActionDocState[] = [];

  private actionDocSubject = new Subject<ActionDocState>();

  constructor(
    private docService: ApiActionDocService,
    private connectionService: ConnectionService) {
  }

  public get whenActionDocReady(): Observable<ActionDocState> {
    return this.actionDocSubject.asObservable();
  }

  // The currently configured connections.
  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
  }

  public get connectionActionDocLinks(): Link[] {
    return _.map(this.connectionActionDocs, ad => ad.link);
  }

  public setCurrentConn(connection: ApiConnection) {

    // If no change in collection no state change required.
    if (connection === this.selectedConnection) {
      return;
    }

    this.selectedConnection = connection;

    if (!this.connectionDocs.has(connection.id)) {
      this.connectionDocs.set(connection.id, []);
    }

    this.connectionActionDocs = this.connectionDocs.get(connection.id);

    if (this.connectionActionDocs.length > 0) {
      this.actionDocSubject.next(this.connectionActionDocs[this.connectionActionDocs.length-1]);
    }
  }

  // Loads a related link's Action Doc on the current connection.
  public loadRelatedActionDoc(link: Link) {
    this.loadActionDoc(this.selectedConnection, link);
  }

  // Determines if there was a prior selected action document.  If not, the next
  // best match is determined.
  public loadLastActionDoc() {

    // There was a prior selected action document.
    if (this.selectedActionDocState !== null) {
      this.actionDocSubject.next(this.selectedActionDocState);
      return;
    }

    //  No selected action document, but there is a selected connection, so notify
    // subscriber of the last document loaded on the selected connection.
    if (this.selectedConnection !== null && this.connectionDocs.has(this.selectedConnection.id)) {
       this.connectionActionDocs = this.connectionDocs.get(this.selectedConnection.id);

       this.selectedActionDocState = this.connectionActionDocs.length > 0 ?
         this.connectionActionDocs[this.connectionActionDocs.length-1] : null;
    }
  }

  // Loads a new Action Document on the
  public loadActionDoc(connection: ApiConnection, link: Link) {

    this.setCurrentConn(connection);

    this.selectedActionDocState = _.find(this.connectionActionDocs,
        ads => ads.link.docQuery === link.docQuery);

    // If the action document has already been loaded, notify subscribes.
    if (this.selectedActionDocState) {
      this.actionDocSubject.next(this.selectedActionDocState);
      return;
    }

    // Load the action document by calling the REST Api Doc endpoint.
    this.docService.LoadApiActionDoc(connection, link).pipe(
      take(1),
      map(actionDoc => {
        this.selectedActionDocState = new ActionDocState(connection, link);
        this.selectedActionDocState.setReceivedDocInfo(actionDoc, this.createResourceItems(actionDoc));

        this.connectionActionDocs.push(this.selectedActionDocState);
        this.actionDocSubject.next(this.selectedActionDocState);
      })
    ).subscribe();
  }

  private createResourceItems(actionDoc: ApiActionDoc): SelectionItem[] {
    return _.map(actionDoc.responseDocs, rd => {
        const item = new SelectionItem();

        item.objKey = rd;
        item.displayValue = `${rd.status} - ${rd.resourceDoc.resourceName}`;
        return item;
    });
  }
}
