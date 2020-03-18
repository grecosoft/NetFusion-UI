import { NgModule } from '@angular/core';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material';

@NgModule({
    declarations: [
        JsonViewerComponent],
    imports: [CommonModule, MatToolbarModule],
    exports: [
        JsonViewerComponent]
})
export class CommonComponentsModule {

}