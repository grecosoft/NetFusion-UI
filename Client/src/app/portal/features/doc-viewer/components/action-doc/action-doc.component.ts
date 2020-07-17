import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {DocApplication} from '../../services/DocApplication';
import {ApiActionDoc, ApiRelationDoc, ApiResourceDoc, ApiResponseDoc} from '../../types/doc-types';
import {ActionDocNavInfo, ActionDocState} from '../../types/app-types';
import {Link} from '../../../../../common/client/Resource';
import {ApiConnection} from '../../../../../types/connection-types';

// The main component navigated to display documentation associated
// with a given resource.  When this component is navigated, the
// caller is expected to pass the current connection and the link
// containing the URL of the resource.  This URL is used to query
// the actions documentation.
@Component({
  selector: 'app-action-doc',
  templateUrl: './action-doc.component.html',
  styleUrls: ['./action-doc.component.scss']
})
export class ActionDocComponent implements OnInit, OnDestroy{

  // Optional information provided by caller initiating the navigation.
  private readonly actionDocNav: ActionDocNavInfo = null;

  // The selected Action Document and the currently selected
  // response document.
  public currentActionDocState: ActionDocState;
  public selectedResponseDoc: ApiResponseDoc;

  private actionDocReadySubscription: Subscription = null;

  constructor(
    private router: Router,
    public application: DocApplication) {

    this.subscribeToActionDocLoaded();

    this.actionDocNav = this.router.getCurrentNavigation()
      .extras.state as ActionDocNavInfo;
  }

  public ngOnInit(): void {

    // If the caller specified navigation for a specific action document
    // request the documentation from the application.
    if (this.actionDocNav) {
      this.application.loadActionDoc(this.actionDocNav.connection, this.actionDocNav.populatedLink.link);
    } else {
      this.application.loadLastActionDoc();
    }
  }

  private subscribeToActionDocLoaded() {

    this.actionDocReadySubscription = this.application.whenActionDocReady.subscribe(actionDocState => {
      this.currentActionDocState = actionDocState;
      this.selectedResponseDoc = actionDocState.currentResponseDoc;
    });
  }

  public get actionDoc(): ApiActionDoc {
    return this.currentActionDocState?.actionDoc;
  }

  public onConnectionSelected(connection: ApiConnection) {
    this.application.setCurrentConn(connection);
  }

  public onActionLinkSelected(link: Link) {
    this.application.loadRelatedActionDoc(link);
  }

  public onActionResponseSelected() {
    this.currentActionDocState.setCurrentResponseDoc(this.selectedResponseDoc);
  }

  public onChildResourceSelected(resourceDoc: ApiResourceDoc) {
    this.currentActionDocState.recordVisitedResourceDoc(resourceDoc);
  }

  public get isCloseDisabled(): boolean {
    return this.application.selectedActionDocState === null;
  }

  public onCloseSelectedActionDoc() {
    this.application.closeCurrentActionDoc();
  }

  // Called when a document is to be loaded for a selected link
  // associated when a resource of the current document.
  public onNavToActionDoc(relationDoc: ApiRelationDoc) {

    const link: Link = {
      docQuery: relationDoc.hRef,
      href: relationDoc.hRef,
      name: relationDoc.name,
      methods: [relationDoc.method],
      templated: true
    };

    this.application.loadRelatedActionDoc(link);
  }

  // Called when the user moves back to a parent loaded resource document.
  public onVisitedResourceSelected(resourceDoc: ApiResourceDoc) {
    this.currentActionDocState.setCurrentVisitedResourceDoc(resourceDoc);
  }

  public ngOnDestroy(): void {
    if (this.actionDocReadySubscription !== null) {
      this.actionDocReadySubscription.unsubscribe();
    }
  }
}
