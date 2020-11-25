import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from "rxjs/operators";

import { IAppState } from 'src/app/state';
import { actionCreators } from 'src/app/state/auth/actions';
import { IAuthState } from 'src/app/state/auth/reducer';
import { Router } from '@angular/router';
import { BaseComponent } from '../../common/base-component/base-component.component';

@Component({
    selector: "app-signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.css"]
})
export class SigninComponent extends BaseComponent implements OnInit, OnDestroy {
    private authState$: Observable<IAuthState>;

    public email = "";
    public password = "";
    public isSubmitDisabled = false;
    public isLoading = false;

    constructor(
        protected store: Store<IAppState>,
        private router: Router
    ) {
        super(store);
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
    }

    public onSubmit(): void {
        this.isLoading = true;
        this.isSubmitDisabled = true;
        this.store.dispatch(actionCreators.signin(this.email, this.password));
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.store.dispatch(actionCreators.clearSigninStatus());
    }
}
