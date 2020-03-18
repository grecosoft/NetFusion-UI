import { NgModule } from '@angular/core';

import { ConfirmationService } from './confirmation/ConfirmationService';
import { VerifyActionComponent } from './confirmation/component/verify-action.component';

// Angular Modules:
import { CommonModule } from '@angular/common';

// UI Modules:
import { FlexLayoutModule } from "@angular/flex-layout";
import {  
    MatButtonModule, 
    MatInputModule, 
    MatDialogModule,
    MatIconModule
} from '@angular/material';

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