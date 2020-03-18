import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmResponseTypes, ConfirmSettings } from '../types';

@Component({

    styleUrls: ['confirmation.scss'],

    template: `
        <div class="dialog-title" mat-dialog-title color>
            <mat-icon svgIcon="question_answer"></mat-icon>
            <span class="caption-text">{{data.title}}</span>
        </div>
        <div mat-dialog-content>
            <p>{{data.message}}</p>
        </div>
        <div mat-dialog-actions>
            <button mat-button (click)="onConfirmed()" tabindex="2">{{ data.confirmText }}</button>
            <button mat-button (click)="onCancel()" tabindex="-1">{{ data.cancelText }}</button>
        </div>  
    `
})
export class VerifyActionComponent {

    public constructor(
        public dialogRef: MatDialogRef<VerifyActionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmSettings) {

    }

    public onConfirmed() {
        this.dialogRef.close(ConfirmResponseTypes.ActionConfirmed);
    }

    public onCancel() 
    {
        this.dialogRef.close(ConfirmResponseTypes.ActionCanceled);
    }
}





