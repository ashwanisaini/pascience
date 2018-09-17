import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';

const routes: Routes = [
    // {
    //     path: '',
    //     loadChildren: './layout/layout.module#LayoutModule',
    //     canActivate: [AuthGuard]
    // },
    {
        path: 'admin',
        loadChildren: './admins/admins.module#AdminsModule',
        canActivate: [AuthGuard],
        data: { roles: ['super-admin'] }
    },
    // {
    //     path: 'frontend',
    //     loadChildren: './frontend/layout.module#LayoutModule',
    //     canActivate: [AuthGuard],
    //     data: { roles: ['super-admin'] }
    // },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: 'signup',
        loadChildren: './signup/signup.module#SignupModule'
    },
    {
        path: '',
        loadChildren: './front-end/frontend.module#FrontendModule',
        canActivate: [AuthGuard],
        data: { roles: ['users'] }
    },
    {
        path: 'not-found',
        loadChildren: './not-found/not-found.module#NotFoundModule'
    },
  //  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,{useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
