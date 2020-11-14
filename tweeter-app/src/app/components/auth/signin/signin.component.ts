import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ofType } from "@ngrx/effects";
import { takeUntil } from "rxjs/operators";

import { IAppState } from 'src/app/state';
import { actionCreators, actionTypes, IAuthState } from 'src/app/state/auth';
import { Router } from '@angular/router';

@Component({
    selector: "app-signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit, OnDestroy {
    private destroyed$ = new Subject();
    private authState$: Observable<IAuthState>;

    public email = "";
    public password = "";
    public isSubmitDisabled = false;
    public isLoading = false;

    constructor(
        private actions$: ActionsSubject,
        private store: Store<IAppState>,
        private router: Router
    ) {
        this.authState$ = store.select("auth");
    }

    ngOnInit(): void {
        this.authState$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((state) => {
            if (state.signinStatus === "errorNetwork") {
                this.isLoading = false;
                this.isSubmitDisabled = false;
            } else if (state.signinStatus === "successNetwork") {
                this.router.navigate(["/"]);
            }
        });

        // this.actions$.pipe(
        //     ofType(actionTypes.signinError),
        //     takeUntil(this.destroyed$)
        // ).subscribe(() => {
        //     this.isLoading = false;
        //     this.isSubmitDisabled = false;
        // });
    }

    public onSubmit(): void {
        this.isLoading = true;
        this.isSubmitDisabled = true;
        this.store.dispatch(actionCreators.signin(this.email, this.password));
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        this.store.dispatch(actionCreators.clearSigninStatus());
    }
}
