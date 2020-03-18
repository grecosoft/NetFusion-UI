import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RequestClient } from './RequestClient';
import { ApiRequest } from './Request';
import { RequestSettings } from './Settings';
import { IHalEntryPointResource } from './Resource';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorResponseInfo } from './ErrorResponseInfo';


@Injectable()
export class RequestClientFactory {

    private clients: Map<string, RequestClient> = new Map();
    private entryResources: Map<string, IHalEntryPointResource> = new Map();

    private errorResponseSubject = new Subject<ErrorResponseInfo>();

    public constructor(
        private httpClient: HttpClient) {


    }

    public createClient(name: string, baseAddress: string): RequestClient {
        const defaultSettings = RequestSettings.create((settings) => {
            settings.useHalDefaults();
        });

        const client = new RequestClient(this.httpClient, baseAddress, defaultSettings);
        client.registerErrorCallback(error => this.onErrorResponse(client, error));

        this.clients[name] = client;
        return this.clients[name];
    }

    public removeClient(name: string) {
        this.clients.delete(name);
        this.entryResources.delete(name);
    }

    public getClient(name: string): RequestClient {
        const client = this.clients[name];
        if (client == null) {

        }
        return client;
    }

    public get whenErrorResponse(): Observable<ErrorResponseInfo> {
        return this.errorResponseSubject;
    }

    public getEntryPointResource(name: string, entryPath: string): Observable<IHalEntryPointResource> {
        const entryPointResource = this.entryResources[name];
        if (!entryPointResource) {
            return this.loadEntryPointResource(name, entryPath).pipe(
                map((entryPoint) => {
                    this.entryResources[name] = entryPoint;
                    return entryPoint;
                }));
        }
        return of(entryPointResource);
    }

    private onErrorResponse(client: RequestClient, error: HttpErrorResponse) {

        this.errorResponseSubject.next({
            client,
            httpError: error,
            time: new Date()
        });
    }

    private loadEntryPointResource(name: string, entryPath: string): Observable<IHalEntryPointResource> {
        const client = this.getClient(name);

        const request = ApiRequest.get(entryPath);
        return client.send<IHalEntryPointResource>(request).pipe(
            map( response => response.content)
        );
    }
}
