import {Component} from '@angular/core';
import {MessageLogApplication} from '../../services/MessageLogApplication';

@Component({
  selector: 'message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.scss']
})
export class MessageLogComponent {

    constructor(private application: MessageLogApplication) {

      const conn = this.application.connections[3];
      this.application.startReceiving(conn);

    }
}
