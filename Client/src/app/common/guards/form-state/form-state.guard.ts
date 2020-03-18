import { Observable, Subject } from 'rxjs';
import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { FormStateComponent, ConfirmationData } from './component/form-state.component';

export interface ComponentFormState {
    formGroupToValidate: () => FormGroup;
}
   
@Injectable({
    providedIn: 'root',
}) 
export class FormStateGuard implements CanDeactivate<ComponentFormState> {
    
    private _canDeactivateSubject = new Subject<boolean>();

    constructor(
        public dialog: MatDialog) {

    }

    public canDeactivate(component: ComponentFormState) {
        
        // Determine if the component supports the stopping of navigation
        // based on form state.
        let componentFormGroup = component.formGroupToValidate;
        if (!componentFormGroup) return true;

        // Get the component's form group to determine if user needs
        // to confirm navigation.
        let formGroup = componentFormGroup();
        
        // Determine if the state of the form requires user confirmation:
        let dialogData: ConfirmationData = this.isUnsavedChanges(formGroup);
        if (!dialogData.applies) {
            dialogData = this.isInvalidChanges(formGroup);
        }

        // The state of the form does not require user intervention.
        if (!dialogData.applies) {
            return true;
        }

        // Determine how the user would like to continue based on the 
        // state of the form:
        const dialogRef = this.dialog.open(FormStateComponent, {
            width: '270px',
            disableClose: true,
            data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
            this._canDeactivateSubject.next(result.continue);
        });

        // Return observable that will be awaited for user's selection:
        return this._canDeactivateSubject.asObservable();
    }

    private isUnsavedChanges(formGroup: FormGroup): ConfirmationData {
        return {
            applies: formGroup.dirty && formGroup.valid,
            continue: false,
            message: 'Changes have not been saved.',
            continueBtnValue: 'Ignore Changes',
            cancelBtnValue: 'Cancel'
        };
    }

    private isInvalidChanges(formGroup: FormGroup) {
        return {
            applies: formGroup.dirty && formGroup.invalid,
            continue: false,
            message: 'Changes made are not valid.',
            continueBtnValue: 'Ignore Changes',
            cancelBtnValue: 'Correct'
        };
    }
}