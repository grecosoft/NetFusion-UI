import { NgModule } from '@angular/core';

import { ConfirmationService } from './confirmation/ConfirmationService';
import { VerifyActionComponent } from './confirmation/component/verify-action.component';

// Angular Modules:
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

// UI Modules:
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    providers: [
        ConfirmationService
    ],

    declarations: [
        VerifyActionComponent
    ],

    entryComponents: [
        VerifyActionComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule
    ]
})
export class CommonDialogModule
{

}
