import {ApiConnection} from '../../../../types/connection-types';
import {PopulatedLink} from '../../hal-viewer/types/link-types';
import {ApiActionDoc, ApiResourceDoc, ApiResponseDoc} from './doc-types';
import {SelectionItem} from '../../../../types/common-types';
import {Link} from '../../../../common/client/Resource';

// Records the current state of the user's navigations within
// a given ApiActionDoc.  This is used so the user can navigate
// back and forth between ApiActionDocs instances and have the
// state of their navigations restored.
export class ActionDocState {

  constructor(
    // The link for which documentation is to be retrieved and the
    // connection of the corresponding WebApi.
    public connection: ApiConnection,
    public link: Link) {
  }

  // The documentation associated with WebApi action to which the
  // the link corresponds.
  public actionDoc: ApiActionDoc;

  // Listing of the possible Api responses for selection and
  // the current selected response.
  public responseItems: SelectionItem[] = [];
  public currentResponseDoc: ApiResponseDoc;

  // As the user navigates between resource documentation,
  // the following records the hierarchy transversed.
  public visitedResourceDocs: ApiResourceDoc[] = [];

  public setReceivedDocInfo(actionDoc: ApiActionDoc, responseItems: SelectionItem[]) {
    this.actionDoc = actionDoc;
    this.responseItems = responseItems;

    if (actionDoc.responseDocs.length > 0) {
      this.currentResponseDoc = actionDoc.responseDocs[0];
      this.recordVisitedResourceDoc(this.currentResponseDoc.resourceDoc);
    }
  }

  // Set the current Api Response Document that is being viewed.  Any child
  // navigated to Resource Documents are cleared and the Resource Document
  // of the selected response becomes the current.
  public setCurrentResponseDoc(responseDoc: ApiResponseDoc) {
    this.visitedResourceDocs.length = 0;
    this.currentResponseDoc = responseDoc;
    this.recordVisitedResourceDoc(responseDoc.resourceDoc);
  }

  // Adds a child Resource Document of the current parent to the list
  // of visited resources.  This is used so the user can navigate back
  // to a specific parent resource.
  public recordVisitedResourceDoc(resourceDoc: ApiResourceDoc) {
    this.visitedResourceDocs.push(resourceDoc);
  }

  // Makes the specified Resource Document the current by removing
  // all Resource Documents that were loaded afterwards.
  public setCurrentVisitedResourceDoc(resourceDoc: ApiResourceDoc) {
    this.visitedResourceDocs.length = this.visitedResourceDocs.indexOf(resourceDoc) + 1;
  }

  public get currentResourceDoc(): ApiResourceDoc {
    return this.visitedResourceDocs[this.visitedResourceDocs.length-1];
  }
}

export class ActionDocNavInfo {
  connection: ApiConnection;
  populatedLink: PopulatedLink;
}
