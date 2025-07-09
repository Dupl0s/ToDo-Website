import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class LoggedActivate implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.userService.userValue;
        if (user) {
            console.log(user.username + " is there")
            return true;
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        console.log("No user is there")
        return false;
    }
}