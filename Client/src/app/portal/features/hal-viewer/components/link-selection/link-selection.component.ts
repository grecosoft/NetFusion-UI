import * as _ from 'lodash';
import {Component, Input, Output, OnChanges, EventEmitter, SimpleChanges} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Link, IHalResource} from 'src/app/common/client/Resource';
import {LinkViewModel, ParamValue, PopulatedLink} from '../../types/link-types';

// Displays the links associated with a resource and raises
// an event when a specific link is selected.  If the selected
// links is a template and has parameters, an input filed is
// showed for each parameter.
@Component({
    selector: 'app-link-selection',
    templateUrl: './link-selection.component.html',
    styleUrls: ['./link-selection.component.scss']
})
export class LinkSelectionComponent  implements OnChanges {

    // The containing the links to be displayed.
    @Input('resource')
    public resource: IHalResource;

    // Specifies the content to use for a link with a method
    // having an associated body.
    @Input('content')
    public content: string;

    // Event raised to notify parent component that the
    // contents for the link is being populated.
    @Output('linkPopulating')
    public linkPopulating: EventEmitter<LinkViewModel>;

    // Event that is emitted when the user selects a link or
    // after a template based link is fully populated.
    @Output('linkSelected')
    public linkSelected: EventEmitter<PopulatedLink>;

    @Output('displayLinkDocs')
    public displayLinkDocs: EventEmitter<PopulatedLink>;

    public constructor() {

        this.linkPopulating = new EventEmitter<LinkViewModel>();
        this.linkSelected = new EventEmitter<PopulatedLink>();
        this.displayLinkDocs = new EventEmitter<PopulatedLink>();
    }

    // The links contained on the resource used to make associated requests.
    public resourceLinks: LinkViewModel[];
    public resourceLinkColumns = ['relName', 'method', 'documentation', 'resourceUrl'];

    // An input group used to specify values for a URL containing template parameters.
    public paramNameColumns = ['name', 'input'];
    public paramValueEntry: FormGroup = null;
    public paramValueInputs: ParamValue[];

    // The currently selected link.
    private selectedLink: LinkViewModel;

    // Invoked when an input property on the component
    // is updated.
    public ngOnChanges(changes: SimpleChanges) {
      this.checkUpdatedResource(changes);
      this.checkUpdatedContent(changes);
    }

    private checkUpdatedResource(changes: SimpleChanges) {
      if (!changes.hasOwnProperty('resource')) {
        return;
      }

      this.selectedLink = null;
      if (this.resource) {
        this.populateResourceLinks(this.resource);
      }
    }

    private checkUpdatedContent(changes: SimpleChanges) {
      if (!this.paramValueEntry || !changes.hasOwnProperty('content')) {
        return;
      }

      this.paramValueEntry.get('content').setValue(this.content);
      this.paramValueEntry.markAsDirty();
    }

    // Creates a list of view models for each resource associated link.
    private populateResourceLinks(resource: IHalResource) {

        const viewModels: LinkViewModel[] = [];

        _.forOwn(resource._links, (link: Link, relName: string) => {
            viewModels.push(new LinkViewModel(relName, link));
        });

        this.resourceLinks = viewModels;
    }

    public get hasParameters(): boolean {
        return this.paramValueInputs.length > 0;
    }

    // Called to populate a URL containing template parameters before
    // it can be submitted to the server.  Creates a form group for
    // each template parameter for entry.
    public populateUrl(resourceLink: LinkViewModel) {
        this.selectedLink = resourceLink;
        const paramNames = this.getUrlParamNames(this.selectedLink.associatedLink);

        this.createParamInputEntry(resourceLink, paramNames);
        this.linkPopulating.emit(resourceLink);
    }

    public get hasContentBody(): boolean {
      if (this.selectedLink) {
        return this.selectedLink.hasContentBody;
      }
      return false;
    }

    // Invoked when user selects a non-template URL.
    public executeUrl(resourceLink: LinkViewModel) {
        this.linkSelected.emit(
            new PopulatedLink(resourceLink.relName, resourceLink.associatedLink, null));
    }

    // Invoked after the user has specified any URL template parameters:
    public executeUrlTemplate() {

        // Get the state of the entered parameter values from the form-group.
        const paramValues = Object.assign({}, this.paramValueEntry.value);

        const selectedResourceLink = new PopulatedLink(this.selectedLink.relName, this.selectedLink.associatedLink, paramValues);

        if (this.hasContentBody) {
            selectedResourceLink.content = paramValues.content;
            delete paramValues.content;
        }

        this.linkSelected.emit(selectedResourceLink);
    }

    public onViewActionDoc(populatedLink: PopulatedLink) {
      this.displayLinkDocs.emit(populatedLink);
    }

    // Creates an Angular input group and adds an input control for each template parameter.
    private createParamInputEntry(resourceLink: LinkViewModel, paramNames: string[]) {
        const group = new FormGroup({});
        const paramEntries: ParamValue[] = [];

        _.forEach(paramNames, pn => {
            const control = new FormControl(null, Validators.required);
            group.addControl(pn, control);

            paramEntries.push(new ParamValue(pn, control));
        });

        if (resourceLink.hasContentBody) {
            const contentControl = new FormControl(null);
            group.addControl('content', contentControl);
        }

        this.paramValueEntry = group;
        this.paramValueInputs = paramEntries;
    }

    private getUrlParamNames(link: Link): string[] {
        const paramNames = link.href.match(/{(.*?)}/g);
        return _.map(paramNames, (name) => name.replace('{', '').replace('}', ''));
    }
}
