import { NgModule } from '@angular/core';
import { FormStateComponent } from './form-state/component/form-state.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

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
