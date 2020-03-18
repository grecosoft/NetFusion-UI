import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable()
export class LocalStorageService {

    constructor(
         @Inject(LOCAL_STORAGE) private storage: StorageService) {
    }

    public saveValue(storageKey: string, value: any) {
        this.storage.set(storageKey, value);
    }

    public getValue<T>(storageKey: string): T {
      return this.storage.get(storageKey) as T;
    }
}
