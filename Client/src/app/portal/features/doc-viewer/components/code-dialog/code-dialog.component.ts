import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {ClipboardService} from 'src/app/services/ClipboardService';
import {EventBusService} from 'src/app/services/EventBusService';
import {AlertEvent} from 'src/app/portal/events/AlertEvent';

import {CodeDialogData} from '../../types/app-types';

@Component({
  selector: 'app-code-dialog',
  templateUrl: './code-dialog.component.html',
  styleUrls: ['./code-dialog.component.scss']
})
export class CodeDialogComponent {

  constructor(
    private clipboardService: ClipboardService,
    private dialogRef: MatDialogRef<CodeDialogComponent>,
    private eventBus: EventBusService,
    @Inject(MAT_DIALOG_DATA) public data: CodeDialogData) {

  }

  public onCopy() {
    this.clipboardService.copyToClipboard(this.data.code);
    this.dialogRef.close();

    const alertEvt = AlertEvent.withMessage('Code copied to Clipboard');
    this.eventBus.publish(alertEvt);
  }
}
