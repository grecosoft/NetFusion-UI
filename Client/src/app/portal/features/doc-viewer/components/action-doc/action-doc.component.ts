import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {SelectionItem} from 'src/app/types/common-types';
import {ApiConnection} from 'src/app/types/connection-types';
import {PopulatedLink} from 'src/app/portal/features/hal-viewer/types/link-types';

import {ApiActionDocService} from '../../services/ApiActionDocService';
import {DocApplication} from '../../services/DocApplication';
import {ApiActionDoc, ApiRelationDoc, ApiResourceDoc, ApiResponseDoc} from '../../types/doc-types';
import {ActionDocState} from '../../types/app-types';


// The main component navigated to display documentation associated
// with a given resource.  When this component is navigated, the
// caller is expected to pass the current connection and the link
// containing the URL of the resource.  This URL is used to query
// the resource's documentation.
@Component({
  selector: 'app-action-doc',
  templateUrl: './action-doc.component.html',
  styleUrls: ['./action-doc.component.scss']
})
export class ActionDocComponent implements OnInit {

  private actionDocState: ActionDocState;


  // The link for which documentation is to be retrieved and the
  // connection of the corresponding WebApi.
  private readonly connection: ApiConnection;
  private readonly populatedLink: PopulatedLink;

  // The documentation associated with WebApi action to which the
  // the link corresponds.
  public actionDoc: ApiActionDoc;

  // Listing of the possible Api responses for selection.
  public responseItems: SelectionItem[] = [];
  public selectedResponseDoc: ApiResponseDoc;

  // As the user navigates between resource documentation,
  // the following records the hierarchy transversed.
  public visitedResourceDocs: ApiResourceDoc[] = [];

  constructor(
    private router: Router,
    private docApplication: DocApplication,
    private docService: ApiActionDocService) {

    const state = this.router.getCurrentNavigation().extras.state;
    this.actionDocState = new ActionDocState(state.conn, state.populatedLink);

    this.connection = state.connection;
    this.populatedLink = state.populatedLink;

    this.subscribeToActionDocLoaded();
  }

  public ngOnInit(): void {
    this.docService.LoadApiActionDoc(this.connection, this.populatedLink.link);
  }

  private subscribeToActionDocLoaded() {
    this.docService.whenActionDocLoaded.subscribe(actionDoc => {
      this.actionDoc = actionDoc;
      this.responseItems = this.createResourceItems();

      this.actionDocState.setReceivedDocInfo(actionDoc, this.createResourceItems());

      if (this.actionDoc.responseDocs.length > 0) {
        this.selectedResponseDoc = this.actionDoc.responseDocs[0];
        this.onNavToResourceDoc(this.selectedResponseDoc.resourceDoc);
      }
    });
  }

  public createResourceItems(): SelectionItem[] {
    return _.map(this.actionDoc.responseDocs, rd => {
      {
        const item = new SelectionItem();
        item.objKey = rd;
        item.displayValue = `${rd.status} - ${rd.resourceDoc.resourceName}`;
        return item;
      }
    });
  }

  public onResourceSelected()
  {
    this.visitedResourceDocs.length = 0;
    this.onNavToResourceDoc(this.selectedResponseDoc.resourceDoc)
  }

  public onNavToResourceDoc(resourceDoc: ApiResourceDoc) {
    this.visitedResourceDocs.push(resourceDoc);
  }

  public onNavToActionDoc(relationDoc: ApiRelationDoc) {
    console.log(relationDoc);
  }

  public onVisitedResourceSelected(resourceDoc: ApiResourceDoc) {
    this.visitedResourceDocs.length = this.visitedResourceDocs.indexOf(resourceDoc) + 1;
  }

  public get currentResourceDoc(): ApiResourceDoc {
    if (this.visitedResourceDocs.length === 0) {
      return this.selectedResponseDoc.resourceDoc;
    }
    return this.visitedResourceDocs[this.visitedResourceDocs.length-1];
  }
}
