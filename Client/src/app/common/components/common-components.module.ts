import { NgModule } from '@angular/core';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [
        JsonViewerComponent],
    imports: [CommonModule, MatToolbarModule],
    exports: [
        JsonViewerComponent]
})
export class CommonComponentsModule {

}
