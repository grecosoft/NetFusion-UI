import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedIconModule } from './modules/shared-icon.module';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { DashboardComponent } from './portal/dashboard/dashboard.component';
import { GuardsModule } from './common/guards/guards.module';
import { ServicesModule } from './services/services.module';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientModule } from './common/client/client.module';
import { CommonDialogModule } from './common/dialogs/common-dialogs.module';
import {PortalComponentsModule} from './portal/components/portal-components.module';
import {SettingsComponent} from './portal/components/settings/settings.component';
import {ConnectionsComponent} from './portal/components/connections/connections.component';


// Routes for the main application areas:
const areaRoutes: Routes = [
  { path: 'portal/config/settings', component: SettingsComponent },
  { path: 'portal/config/connections', component: ConnectionsComponent },
  { path: 'areas/log', loadChildren: () => import('src/app/portal/features/log-viewer/log-viewer.module').then(mod => mod.LogViewerModule)},
  { path: 'areas/hal', loadChildren: () => import('src/app/portal/features/hal-viewer/hal-viewer.module').then(mod => mod.HalViewerModule)},
  { path: 'areas/doc', loadChildren: () => import('src/app/portal/features/doc-viewer/doc-viewer.module').then(mod => mod.DocViewerModule)},
  { path: '', redirectTo: 'areas/log/dashboard', pathMatch: 'full'}
];

@NgModule({
  declarations: [
      DashboardComponent
  ],
  imports: [
    RouterModule.forRoot(areaRoutes),
    GuardsModule,
    ClientModule,
    CommonDialogModule,
    PortalComponentsModule,

    ServicesModule,
    SharedIconModule,
    StorageServiceModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,

    MatSidenavModule,
    MatButtonToggleModule,
    MatListModule,
    MatSnackBarModule
  ],
   bootstrap: [DashboardComponent]
})
export class AppModule {

}
