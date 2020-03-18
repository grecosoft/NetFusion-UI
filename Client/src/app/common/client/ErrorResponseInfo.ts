import { RequestClient } from './RequestClient';
import { HttpErrorResponse } from '@angular/common/http';

export class ErrorResponseInfo {
    client: RequestClient;
    time: Date;
    httpError: HttpErrorResponse;
}
