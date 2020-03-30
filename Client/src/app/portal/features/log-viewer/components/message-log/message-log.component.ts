import {Component} from '@angular/core';
import {MessageLogService} from '../../services/MessageLogService';

@Component({
  selector: 'message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.scss']
})
export class MessageLogComponent {

    constructor(private messageLogService: MessageLogService) {

      const conn = this.messageLogService.connections[1];
      this.messageLogService.startReceivingOn(conn);

    }

}
