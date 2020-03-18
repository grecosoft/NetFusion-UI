import { Injectable } from '@angular/core'; 
import { MatDialog } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { VerifyActionComponent } from './component/verify-action.component';
import { ConfirmResponseTypes, ConfirmSettings } from './types';

// Contains methods for receiving confirmation from the user for state
// changing actions.
@Injectable()
export class ConfirmationService {

    public constructor(
        private dialog: MatDialog) {

    }

    public verifyAction(confirmation: ConfirmSettings): Observable<ConfirmResponseTypes> {
        let result = new Subject<ConfirmResponseTypes>();

        confirmation.confirmText = confirmation.confirmText || "OK"
        confirmation.cancelText = confirmation.cancelText || "Cancel";

        let settings = {
            width: '500px',
            disableClose: true,
            hasBackdrop: true,
            data: confirmation
          };

        this.dialog.open(VerifyActionComponent, settings)
            .afterClosed().subscribe(response => {
                
                result.next(response);
        });

        return result.asObservable();
    }
}