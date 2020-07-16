import { Injectable } from '@angular/core';
import { PortalApp, PortalArea, AreaSection } from '../types/navigation-types';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';
import { AlertService } from './AlertService';
import {ConnectionService} from './ConnectionService';

// Service managing the portal's navigation and provides
// observables used by components to detect route changes.
@Injectable()
export class PortalService {

    private readonly portal: PortalApp;
    private selectedAreaUpdated: Subject<PortalArea>;
    private selectedSectionUpdated: Subject<AreaSection>;

    constructor(
        private router: Router,
        private  connectionService: ConnectionService,
        _: AlertService) {

        this.selectedAreaUpdated = new Subject<PortalArea>();
        this.selectedSectionUpdated = new Subject<AreaSection>();
        this.portal = new PortalApp();

        this.declarePortalAreas(this.portal);
        this.monitorRouteChanges();

        connectionService.loadConnections();
    }

    // Observables:
    public get onSelectedAreaUpdated(): Observable<PortalArea> {
        return this.selectedAreaUpdated.asObservable();
    }

    public get onSelectedSectionUpdated(): Observable<AreaSection> {
        return this.selectedSectionUpdated.asObservable();
    }

    // Service API:
    public getPortalAreas(): PortalArea[] {
        return this.portal.areas;
    }

    public setPortalArea(area: PortalArea) {
        this.router.navigateByUrl(area.entrySection.route).then(r => {});
    }

    public setAreaSection(section: AreaSection) {
        this.router.navigateByUrl(section.route).then(r => {});
    }

    // Navigation State Management:
    private monitorRouteChanges() {
        this.router.events.subscribe((event: Event) => {

            if (event instanceof NavigationEnd) {

                // Determine the area and section based on the new route
                // being navigated to.  Then notify subscribing clients.
                const navArea = this.getCurrentRouteSelections(event.url);

                if (navArea.area == null || navArea.section == null) {
                    return;
                }

                this.selectedAreaUpdated.next(navArea.area);
                this.selectedSectionUpdated.next(navArea.section);
            }
        });
    }

    // Based on the current route URL being navigate to, determines the associated
    // area and section.
    private getCurrentRouteSelections(url: string): {area: PortalArea, section: AreaSection} {
        let area = _.find(this.portal.areas, a => url.startsWith('/' + a.areaRoute));
        let section = null;

        // Default to first area and section if the area could not
        // be determined based on the route url.
        if (area == null && this.portal.areas.length > 0) {
            area = this.portal.areas[0];
            if (area.sections.length > 0) {
                section = area.sections[0];
                return { area, section};
            }
        }

        // Determine the section within the area based on the route.
        section = _.find(area.sections, a => url.startsWith('/' + a.route));
        return { area, section};
    }

    private declarePortalAreas(portal: PortalApp) {
      portal.addArea(
        new PortalArea('Configuration', 'portal/config', 'build'), [
          new AreaSection('Settings', 'settings', 'settings'),
          new AreaSection( 'Connections', 'connections', 'settings_ethernet')
      ]);

      portal.addArea(
        new PortalArea('Log Viewer', 'areas/log', 'network_check'), [
          new AreaSection('Composite Log', 'composite-log', 'view_compact'),
          new AreaSection('Message Log', 'message-log', 'message')
      ]);

      portal.addArea(
        new PortalArea('Hal Viewer', 'areas/hal', 'find_in_page'), [
          new AreaSection('Api Entries', 'entries', 'play_for_work'),
          new AreaSection('Resources', 'resources', 'layers'),
          new AreaSection('Documentation', 'docs', 'api_docs')
      ]);
    }
}
