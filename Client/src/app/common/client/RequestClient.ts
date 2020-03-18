import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError, of} from 'rxjs';

import {ApiRequest, ApiResponse} from './Request';
import {RequestSettings} from './Settings';
import {map, catchError} from 'rxjs/operators';
import { IHalResource } from './Resource';

export class RequestClient  {

    private errorCallback: (error: HttpErrorResponse) => void;

    constructor(
        private http: HttpClient,
        private baseAddress: string,
        private defaultSettings: RequestSettings) {
    }

    public send<TContent>(request: ApiRequest): Observable<ApiResponse<TContent>> {

        const options = this.buildOptions(request);

        let url = '/';
        if (this.baseAddress.endsWith('/') || request.requestUri.startsWith('/')) {
            url = '';
        }

        url = this.baseAddress + url + request.requestUri;

        return this.http.request<TContent>(request.method, url, options).pipe(
            catchError((error: HttpErrorResponse) => {
                if (this.errorCallback) {
                    this.errorCallback(error);
                }
                
                return throwError(error);
            }),
            map((response: any) => {
              return new ApiResponse<TContent>(response);
            }));
    }

    public call(request: ApiRequest): Observable<ApiResponse<IHalResource>> {
        const options = this.buildOptions(request);

        return this.http.request<IHalResource>(request.method, request.requestUri, options).pipe(
         
            map((response: any) => {
                return new ApiResponse<IHalResource>(response);
              }));
    }

    public registerErrorCallback(callback: (error: HttpErrorResponse) => void) {
        this.errorCallback = callback;
    }

    private buildOptions(request: ApiRequest): { headers: HttpHeaders, params: {[name: string]: string}, body: any} {

        const settings = this.defaultSettings.merge(request.settings);

        if (request.embeddedNames) {
            settings.queryString.addParam('embedded', request.embeddedNames);
        }

        const options = {
            headers: new HttpHeaders(settings.headers.getHeaders()),
            params: settings.queryString.getParams(),
            body: request.content,
            observe: 'response'
        };

        return options;
    }
}
