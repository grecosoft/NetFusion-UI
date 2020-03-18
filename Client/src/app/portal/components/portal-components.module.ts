import {NgModule} from '@angular/core';
import {SharedModule} from '../../modules/shared.module';
import {SharedMatModule} from '../../modules/shared-mat.module';
import {CommonComponentsModule} from '../../common/components/common-components.module';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings/settings.component';
import {ConnectionsComponent} from './connections/connections.component';


const areaRoutes: Routes = [
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [
    SharedModule,
    SharedMatModule,
    CommonComponentsModule,
    RouterModule.forChild(areaRoutes)
  ],
  declarations: [
    // Routed Components:
    SettingsComponent,
    ConnectionsComponent
  ]
})
export class PortalComponentsModule { }
