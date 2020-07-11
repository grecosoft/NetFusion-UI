import {Component} from '@angular/core';
import {ApiConnection} from 'src/app/types/connection-types';
import {ResourceInstance} from '../../types/resource-types';
import {HalApplication} from '../../services/HalApplication';
import {PopulatedLink, LinkViewModel} from '../../types/link-types';
import {ConfirmationService} from '../../../../../common/dialogs/confirmation/ConfirmationService';
import {ConfirmResponseTypes, ConfirmSettings} from '../../../../../common/dialogs/confirmation/types';

// Component allowing the selection of a configured connection and
// of a resource that was loaded using the connection.  The selected
// resource is displayed with its associated links
@Component({
    selector: 'app-resources',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent {

  // The JSON to be bound to a link for a HTTP methods
  // having associated bodies.
  public requestJsonBody: string;

  public constructor(
    public application: HalApplication,
    private confirmation: ConfirmationService) {
  }

  public onConnectionSelected(connection: ApiConnection) {
      this.application.changeConnection(connection);
  }

  public onRootResourceSelected(rootResource: ResourceInstance) {
      this.application.changeRootResource(rootResource);
  }

  // A link was selected.  Navigate to the selected link.
  public onLinkSelected(populatedLink: PopulatedLink) {

    if (populatedLink.modifiesResourceState) {
      const confirmation = new ConfirmSettings(
        'Modifying Resource',
        `Are you sure you want to execute action: ${populatedLink.method}?`);

      confirmation.confirmText = populatedLink.method;

      this.confirmation.verifyAction(confirmation).subscribe((answer) => {
        if (answer === ConfirmResponseTypes.ActionConfirmed) {
          this.application.executeResourceLink(populatedLink);
        }
      });

      return;
    }

    this.requestJsonBody = null;
    this.application.executeResourceLink(populatedLink);
  }

  public onLinkPopulating(link: LinkViewModel) {
    this.application.currentResource.useJsonAsContentEnabled = link.hasContentBody;
  }

  public onViewErrors() {
    this.application.viewRootResourceErrors();
  }

  // --------------- State Flags ---------------------

  public get isCloseDisabled(): boolean {
      return this.application.selectedRootResource === null
        || this.application.selectedRootResource === undefined;
  }

  public onCloseSelectedResource() {
      this.application.closeSelectedResource();
  }

  public onCloseAllResources() {

    const confirmation = new ConfirmSettings(
      'Close all Resources',
      `Are you sure you want to close all resources?`);

    confirmation.confirmText = 'Close';

    this.confirmation.verifyAction(confirmation).subscribe((answer) => {
      if (answer === ConfirmResponseTypes.ActionConfirmed) {
        this.application.closeAllResources();
      }
    });
  }

  public setRequestContent(json: string) {
    this.requestJsonBody = json;
  }

  public get isCloseAllDisabled(): boolean {
    return this.application.connectionRootResources === undefined
      || this.application.connectionRootResources === null
      || this.application.connectionRootResources.length === 0;
  }
}
