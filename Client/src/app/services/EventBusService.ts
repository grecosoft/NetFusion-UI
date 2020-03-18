import { Injectable } from '@angular/core';
import { Subject, Observable} from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventBase} from '../types/eventBus-types';

@Injectable()
export class EventBusService {

    private _eventBus: Subject<EventBase> = new Subject<EventBase>();

    public publish<T extends EventBase>(event: T) {
        this._eventBus.next(event);
    }

    public subscribe<T extends EventBase>(event: T): Observable<T> {
        return <Observable<T>>this._eventBus.asObservable().pipe(
            filter((e: EventBase) => e.eventKey === event.eventKey)
        );
    }
}
