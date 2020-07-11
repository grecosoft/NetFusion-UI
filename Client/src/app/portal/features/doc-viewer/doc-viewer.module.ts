import {NgModule} from '@angular/core';
import {ActionDocComponent} from './components/action-doc/action-doc.component';
import {ApiActionDocService} from './services/ApiActionDocService';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../modules/shared.module';
import {SharedMatModule} from '../../../modules/shared-mat.module';
import {CommonComponentsModule} from '../../../common/components/common-components.module';
import {HttpClientModule} from '@angular/common/http';

const areaRoutes: Routes = [
  { path: 'action-doc', component: ActionDocComponent }
];

@NgModule({
  imports: [
    SharedModule,
    SharedMatModule,
    CommonComponentsModule,
    HttpClientModule,
    RouterModule.forChild(areaRoutes)
  ],

  declarations: [
    ActionDocComponent
  ],
  providers: [
    ApiActionDocService
  ]
})
export class DocViewerModule {

}

