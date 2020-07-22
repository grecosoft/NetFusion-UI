import {Injectable} from '@angular/core';

import * as _ from 'lodash';
import {map, take} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

import {ApiActionDocService} from './ApiActionDocService';
import {ActionDocState} from '../types/app-types';
import {ApiConnection} from '../../../../types/connection-types';
import {ApiActionDoc, ApiResourceDoc} from '../types/doc-types';
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

  // Subjects:
  private actionDocSubject = new Subject<ActionDocState>();
  private resourceCodeSubject  = new Subject<string>();

  constructor(
    private docService: ApiActionDocService,
    private connectionService: ConnectionService) {
  }

  // Observable used to notify subscribers of when an action
  // document is to be displayed.
  public get whenActionDocReady(): Observable<ActionDocState> {
    return this.actionDocSubject.asObservable();
  }

  public  get whenResourceCodeReady(): Observable<string> {
    return this.resourceCodeSubject.asObservable();
  }

  // The currently configured connections.
  public get connections(): ApiConnection[] {
    return this.connectionService.connections;
  }

  // The links associated with all action-documents loaded on a given
  // Api connection.  This allows moving between the different loaded
  // action-documents for the current connections.
  public get connectionActionDocLinks(): Link[] {
    return _.map(this.connectionActionDocs, ad => ad.link);
  }

  // Called to change the currently selected connection and update
  // the list of action-documents associated when the connection.
  public setCurrentConn(connection: ApiConnection) {

    // If no change in collection no state change required.
    if (connection === this.selectedConnection) {
      return;
    }

    this.selectedConnection = connection;
    this.selectedActionDocState = null;

    // Create an entry for the connection's loaded document if not present.
    if (!this.connectionDocs.has(connection.id)) {
      this.connectionDocs.set(connection.id, []);
    }

    // Update the list of action documents corresponding to selected connection.
    this.connectionActionDocs = this.connectionDocs.get(connection.id);

    // Notify subscriber of newly selected action document.
    if (this.connectionActionDocs.length > 0) {
      this.selectedActionDocState = this.connectionActionDocs[this.connectionActionDocs.length-1];
    }

    this.actionDocSubject.next(this.selectedActionDocState);
  }

  // Loads a related link's Action Doc on the current connection.
  public loadRelatedActionDoc(link: Link) {
    this.loadActionDoc(this.selectedConnection, link);
  }

  // Loads a new Action Document on selected connection.
  public loadActionDoc(connection: ApiConnection, link: Link) {

    this.setCurrentConn(connection);

    this.selectedActionDocState = _.find(this.connectionActionDocs,
        ads => ads.link.methods[0] === link.methods[0] && ads.link.docQuery === link.docQuery);

    // If the action document has already been loaded, notify subscribes.
    if (this.selectedActionDocState) {
      this.actionDocSubject.next(this.selectedActionDocState);
      return;
    }

    // Load the action document by calling the REST Api Doc endpoint.
    this.docService.LoadApiActionDoc(connection, link).pipe(
      take(1),
      map(actionDoc => {
        this.selectedActionDocState = new ActionDocState();
        this.selectedActionDocState.setReceivedDocInfo(link, actionDoc, this.createResourceItems(actionDoc));

        this.connectionActionDocs.push(this.selectedActionDocState);
        this.actionDocSubject.next(this.selectedActionDocState);
      })
    ).subscribe();
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

      this.actionDocSubject.next(this.selectedActionDocState);
    }
  }

  public loadResourceCode(resourceDoc: ApiResourceDoc) {
    this.docService.LoadResourceCode(this.selectedConnection, resourceDoc.resourceName).pipe(
      take(1),
      map(code => {
        this.resourceCodeSubject.next(code);
      })
    ).subscribe();
  }

  public closeCurrentActionDoc() {
    if (!this.selectedActionDocState) {
      return;
    }

    // Removed the current action document from the list of connection loaded documents.
    const idx = this.connectionActionDocs.indexOf(this.selectedActionDocState);
    this.connectionActionDocs.splice(idx, 1);

    // Select last document in the list of as the new selected document.
    const currNumDocs = this.connectionActionDocs.length;
    this.selectedActionDocState = currNumDocs > 0 ? this.connectionActionDocs[currNumDocs - 1] : null;
    this.actionDocSubject.next(this.selectedActionDocState);
  }

  public closeAllActionDocs() {
    if (this.selectedActionDocState && this.connectionActionDocs) {
      this.connectionActionDocs.length = 0;
      this.selectedActionDocState = null;
      this.actionDocSubject.next(this.selectedActionDocState);
    }
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
