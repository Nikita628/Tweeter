import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IAppState } from '../state';

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
    constructor(private store: Store<IAppState>) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select("auth").pipe(
            take(1),
            map(authState => !!authState.token && !!authState.user)
        );
    }
}
