import {NgModule} from '@angular/core';
import {ActionDocComponent} from './components/action-doc/action-doc.component';
import {ApiActionDocService} from './services/ApiActionDocService';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../modules/shared.module';
import {SharedMatModule} from '../../../modules/shared-mat.module';
import {CommonComponentsModule} from '../../../common/components/common-components.module';
import {HttpClientModule} from '@angular/common/http';
import {DocApplication} from './services/DocApplication';
import {ResourceDocComponent} from './components/resource-doc/resource-doc.component';
import {ParamDocComponent} from './components/param-doc/param-doc.component';
import {CodeDialogComponent} from './components/code-dialog/code-dialog.component';

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
    ActionDocComponent,
    ParamDocComponent,
    ResourceDocComponent,
    CodeDialogComponent
  ],
  providers: [
    DocApplication,
    ApiActionDocService
  ]
})
export class DocViewerModule {

}

