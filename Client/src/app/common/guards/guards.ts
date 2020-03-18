import { Routes } from '@angular/router';
import { FormStateGuard } from './form-state/form-state.guard';


export class Guards {
    
    public static formState(routes: Routes) {
        for (let route of routes){
            route.canDeactivate = route.canActivate || [];
            route.canDeactivate.push(FormStateGuard);
        }
    }
}