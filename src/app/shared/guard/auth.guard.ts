import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('user')) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }

    // canActivate(route: ActivatedRouteSnapshot,
    //             state: RouterStateSnapshot): boolean {
    //
    //     let roles = route.data["roles"] as Array<string>;
    //     return (roles == null || roles.indexOf("the-logged-user-role") != -1);
    // }
}
