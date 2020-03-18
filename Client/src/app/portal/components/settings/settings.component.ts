import {Component, OnInit} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { PortalSettings } from 'src/app/types/settings-types';
import { PortalSettingsService } from 'src/app/services/PortalSettingsService';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public selectedThemeClassName: string;

  constructor(
      private portalSettingsService: PortalSettingsService) {

  }

  public ngOnInit(): void {
    const settings = this.portalSettingsService.getSettings();
    this.selectedThemeClassName = settings.selectedThemeClassName;
  }

  public onThemeSelected(event: MatButtonToggleChange) {
      const settings: PortalSettings = { selectedThemeClassName: event.value };

      this.portalSettingsService.updateSettings(settings);
  }
}
