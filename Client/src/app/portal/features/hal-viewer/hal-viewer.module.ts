import { NgModule} from '@angular/core';
import { SharedModule } from 'src/app/modules/shared.module';
import { SharedMatModule } from 'src/app/modules/shared-mat.module';
import { Routes, RouterModule } from '@angular/router';

import { ResourceViewComponent } from './components/resource-view/resource-view.component';
import { MethodIndicatorComponent } from './components/method-indicator/method-indicator.component';
import { LinkSelectionComponent } from './components/link-selection/link-selection.component';

import { ResourceService } from './services/ResourceService';
import { Guards } from 'src/app/common/guards/guards';
import { EntryViewComponent } from './components/entry-view/entry-view.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { HalApplication } from './services/HalApplication';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';
import {ErrorsViewComponent} from './components/errors-view/errors-view.component';


const areaRoutes: Routes = [
  { path: 'resources', component: ResourcesComponent },
  { path: 'entries', component: EntryViewComponent },
  { path: 'errors', component: ErrorsViewComponent }
];

Guards.formState(areaRoutes);

@NgModule({
    imports: [
        SharedModule,
        SharedMatModule,
        CommonComponentsModule,
        RouterModule.forChild(areaRoutes)
    ],
    providers: [
        HalApplication,
        ResourceService
    ],
    declarations: [
        // Routed Components:
        EntryViewComponent,
        ResourceViewComponent,
        ResourcesComponent,
        ErrorsViewComponent,

        // Dialog Components:

        // Embedded Components:
        LinkSelectionComponent,
        MethodIndicatorComponent
    ]
})
export class HalViewerModule { }
