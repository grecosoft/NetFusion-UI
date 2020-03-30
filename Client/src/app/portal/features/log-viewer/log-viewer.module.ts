import { NgModule} from '@angular/core';
import { SharedModule } from 'src/app/modules/shared.module';
import { SharedMatModule } from 'src/app/modules/shared-mat.module';
import { Routes, RouterModule} from '@angular/router';

import {CompositeLogComponent} from './components/composite-log/composite-log.component';
import {CommonComponentsModule} from '../../../common/components/common-components.module';
import {HttpClientModule} from '@angular/common/http';
import {LogApplication} from './services/LogApplication';
import {LogService} from './services/LogService';
import {PluginInfoComponent} from './components/plugin-info/plugin-info.component';
import {MessageLogComponent} from './components/message-log/message-log.component';
import {MessageLogService} from './services/MessageLogService';

const areaRoutes: Routes = [
    { path: 'composite-log', component: CompositeLogComponent },
    { path: 'message-log', component: MessageLogComponent }
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
      CompositeLogComponent,
      MessageLogComponent,
      PluginInfoComponent
    ],
    providers: [
      LogApplication,
      LogService,
      MessageLogService
    ]
})
export class LogViewerModule {

}

