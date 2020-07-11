import {Component} from '@angular/core';
import {MessageLogApplication} from '../../services/MessageLogApplication';
import {FormControl} from '@angular/forms';
import {ApiConnection} from '../../../../../types/connection-types';
import {SelectionItem} from '../../../../../types/common-types';

@Component({
  selector: 'app-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.scss']
})
export class MessageLogComponent {

  public connections = new FormControl();
  public sortOrder = new FormControl();
  public sortOrders: SelectionItem[];

  constructor(
    public application: MessageLogApplication) {

    this.connections.valueChanges.subscribe((selectedCons: ApiConnection[]) => {
      this.application.startReceiving(selectedCons);
    });

    this.sortOrder.valueChanges.subscribe((selected: SelectionItem) => {
      this.application.setCurrentSort(selected);
    });

    this.defineSortOptions();
  }

  private defineSortOptions() {
    this.sortOrders = [
      { key: 'date-occurred', displayValue: 'Date Occurred' },
      { key: 'correlation-id', displayValue: 'Correlation Id' }
    ];

    this.application.setCurrentSort(this.sortOrders[0]);
    this.sortOrder.setValue(this.sortOrders[0]);
  }

  public getNameValues(values: { [name: string]: string }): { name: string, value: string }[] {
    return Object.getOwnPropertyNames(values).map(n => { return { name: n, value: values[n] } });
  }
}
