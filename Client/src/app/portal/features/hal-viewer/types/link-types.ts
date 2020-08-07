import {Link} from 'src/app/common/client/Resource';
import {FormControl} from '@angular/forms';

export class LinkViewModel {

    public constructor(
        private name: string,
        private link: Link) {

     }

     public get relName(): string {
        return this.name;
     }

     public get resourceUrl(): string {
        return this.link.href;
     }

     public get isTemplate(): boolean {
         return this.link.templated;
     }

     public get method(): string {
         return this.link.method;
     }

     public get associatedLink(): Link {
         return this.link;
     }

     public get hasContentBody(): boolean {
         return this.link.method === 'POST' || this.link.method === 'PUT';
     }
}

export class ParamValue {
    public constructor(
        public paramName: string,
        public paramInput: FormControl) {
    }
}

export class PopulatedLink {

  public content: any;

  public constructor(
      public relName: string,
      public link: Link,
      public linkParams: {[name: string]: any}) {
  }

  public get method(): string {
    return this.link.method;
  }

  public get modifiesResourceState(): boolean {
      const stateChangeMethods = ['POST', 'PUT', 'DELETE'];

      return stateChangeMethods.findIndex( m => m === this.method) > -1;
  }
}
