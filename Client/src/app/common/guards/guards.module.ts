import { NgModule } from '@angular/core';
import { FormStateComponent } from './form-state/component/form-state.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        FormStateComponent],
    entryComponents: [
        FormStateComponent
    ]
})
export class GuardsModule {

}