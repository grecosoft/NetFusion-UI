import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ConfirmationData {
    applies: boolean;
    message: string;
    continue: boolean = false;
    continueBtnValue?: string;
    cancelBtnValue?: string;
}


@Component({
    templateUrl: './form-state.component.html',
    styleUrls: ['./form-state.component.scss']
})
export class FormStateComponent {
    constructor(
        public dialogRef: MatDialogRef<FormStateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationData) {

    }

    public onContinueNavigation() {
        this.data.continue = true;
        this.dialogRef.close(this.data);
    }

    public onCancelNavigation() {
        this.data.continue = false;
        this.dialogRef.close(this.data);
    }
}