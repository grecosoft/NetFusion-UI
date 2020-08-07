import {Component, Input, OnInit} from '@angular/core';
import {DocApplication} from '../../services/DocApplication';
import {ActionDocState} from '../../types/app-types';
import {ApiRelationDoc, ApiResourceDoc} from '../../types/doc-types';
import {Link} from '../../../../../common/client/Resource';

@Component({
  selector: 'app-resource-nav',
  templateUrl: './resource-nav.component.html',
  styleUrls: ['./resource-nav.component.scss']
})
export class ResourceNavComponent {

  @Input('actionDocState')
  public actionDocState: ActionDocState;

  constructor(
    private application: DocApplication) {
  }

  public onChildResourceSelected(resourceDoc: ApiResourceDoc) {
    this.actionDocState.recordVisitedResourceDoc(resourceDoc);
  }

  // Called when a document is to be loaded for a selected link
  // associated when a resource of the current document.
  public onNavToActionDoc(relationDoc: ApiRelationDoc) {

    const link: Link = {
      docQuery: relationDoc.hRef,
      href: relationDoc.hRef,
      name: relationDoc.name,
      method: relationDoc.method,
      templated: true
    };

    this.application.loadRelatedActionDoc(link);
  }

  public onLoadResourceCode(resourceDoc: ApiResourceDoc) {
    this.application.loadResourceCode(resourceDoc);
  }

  // Called when the user moves back to a parent loaded resource document.
  public onVisitedResourceSelected(resourceDoc: ApiResourceDoc) {
    this.actionDocState.setCurrentVisitedResourceDoc(resourceDoc);
  }
}
