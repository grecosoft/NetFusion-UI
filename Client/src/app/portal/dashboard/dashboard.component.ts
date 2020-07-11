import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { PortalService } from 'src/app/services/PortalService';
import { PortalArea, AreaSection } from 'src/app/types/navigation-types';
import { EventBusService } from 'src/app/services/EventBusService';
import { DOCUMENT } from '@angular/common';
import { PortalSettingsService } from 'src/app/services/PortalSettingsService';
import { SettingsUpdatedEvent } from '../events/SettingsUpdatedEvent';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    public selectedArea: PortalArea;
    public mobileQuery: MediaQueryList;

    private selectedSection: AreaSection;
    private mobileQueryListener: () => void;

    private themeClasses = [
        'brown-app-theme',
        'blue-app-theme',
        'teal-app-theme',
        'green-app-theme',
        'orange-app-theme',
        'dark-app-theme',
        'red-app-theme',
        'brown-app-theme'
    ];

    constructor(
        @Inject(DOCUMENT) private document: Document,
        media: MediaMatcher,
        changeDetectorRef: ChangeDetectorRef,
        private portalService: PortalService,
        private eventBusService: EventBusService,
        private portalSettingsService: PortalSettingsService) {

            this.initMobileQuery(media, changeDetectorRef);
            this.monitorNavigationChanges();
            this.monitorSettingChanges();
    }

    public ngOnInit(): void {
        const settings = this.portalSettingsService.getSettings();
        this.setSelectedTheme(settings.selectedThemeClassName);
    }

    public ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    private initMobileQuery(media: MediaMatcher, changeDetectorRef: ChangeDetectorRef) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }

    private monitorNavigationChanges() {
        this.portalService.onSelectedAreaUpdated.subscribe((area: PortalArea) => {
            this.selectedArea = area;
        });

        this.portalService.onSelectedSectionUpdated.subscribe((section: AreaSection) => {
            this.selectedSection = section;
        });
    }

    private monitorSettingChanges() {
        this.eventBusService.subscribe(SettingsUpdatedEvent.key).subscribe(evt => {
            this.setSelectedTheme(evt.settings.selectedThemeClassName);
        });
    }

    private setSelectedTheme(theme: string) {

        for (const themeClasses of this.themeClasses) {
            this.document.body.classList.remove(themeClasses);
        }

        this.document.body.classList.add(theme);
    }

    public get PortalAreas() {
        return this.portalService.getPortalAreas();
    }

    public selectArea(area: PortalArea) {
        this.portalService.setPortalArea(area);
    }

    public selectSection(section: AreaSection) {
        this.portalService.setAreaSection(section);
    }

    public isActiveSection(section: AreaSection): boolean {
        return section === this.selectedSection;
    }
}
