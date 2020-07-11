import {Component, OnInit} from '@angular/core';
import {ApiActionDocService} from '../../services/ApiActionDocService';
import {DocApplication} from '../../services/DocApplication';
import {Router} from '@angular/router';
import {ApiConnection} from '../../../../../types/connection-types';
import {PopulatedLink} from '../../../hal-viewer/types/link-types';

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

  private readonly connection: ApiConnection;
  private readonly populatedLink: PopulatedLink;

  constructor(
    private router: Router,
    private docApplication: DocApplication,
    private docService: ApiActionDocService) {

    const state = this.router.getCurrentNavigation().extras.state;
    this.connection = state.connection;
    this.populatedLink = state.populatedLink;
  }

  private subscribeToActionDocLoaded() {
    this.docService.whenActionDocLoaded.subscribe(actionDoc => {
      console.log(actionDoc);
    });
  }

  public ngOnInit(): void {

    this.docService.LoadApiActionDoc(this.connection, this.populatedLink.link);
  }
}
