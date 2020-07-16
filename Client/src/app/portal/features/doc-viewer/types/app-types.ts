import {ApiConnection} from '../../../../types/connection-types';
import {PopulatedLink} from '../../hal-viewer/types/link-types';
import {ApiActionDoc, ApiResourceDoc, ApiResponseDoc} from './doc-types';
import {SelectionItem} from '../../../../types/common-types';

// Records the current state of the user's navigations within
// a given ApiActionDoc.  This is used so the user can navigate
// back and forth between ApiActionDocs instances and have the
// state of their navigations restored.
export class ActionDocState {

  constructor(
    // The link for which documentation is to be retrieved and the
    // connection of the corresponding WebApi.
    public connection: ApiConnection,
    public populatedLink: PopulatedLink) {
  }

  // The documentation associated with WebApi action to which the
  // the link corresponds.
  public actionDoc: ApiActionDoc;

  // Listing of the possible Api responses for selection.
  public responseItems: SelectionItem[] = [];
  public selectedResponseDoc: ApiResponseDoc;

  // As the user navigates between resource documentation,
  // the following records the hierarchy transversed.
  public visitedResourceDocs: ApiResourceDoc[] = [];

  public setReceivedDocInfo(actionDoc: ApiActionDoc, responseItems: SelectionItem[]) {
    this.actionDoc = actionDoc;
    this.responseItems = responseItems;

    if (actionDoc.responseDocs.length > 0) {
      this.selectedResponseDoc = actionDoc.responseDocs[0];
    }
  }

  public setSelectedResponseDoc(responseDoc: ApiResponseDoc) {
    this.visitedResourceDocs.length = 0;
    this.selectedResponseDoc = responseDoc;
  }

  public recordVisitedResourceDoc(resourceDoc: ApiResourceDoc) {
    this.visitedResourceDocs.push(resourceDoc);
  }

  public setCurrentVisitedResourceDoc(resourceDoc: ApiResourceDoc) {
    this.visitedResourceDocs.length = this.visitedResourceDocs.indexOf(resourceDoc) + 1;
  }

  public get currentResourceDoc(): ApiResourceDoc {
    if (this.visitedResourceDocs.length === 0) {
      return this.selectedResponseDoc.resourceDoc;
    }
    return this.visitedResourceDocs[this.visitedResourceDocs.length-1];
  }
}
