import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from "rxjs/operators";

import { IAppState } from 'src/app/state';
import { actionCreators } from 'src/app/state/auth/actions';
import { IAuthState } from 'src/app/state/auth/reducer';
import { Router } from '@angular/router';
import { BaseComponent } from '../../common/base-component/base-component.component';
import { NgForm } from '@angular/forms';

@Component({
    selector: "app-signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.css"]
})
export class SigninComponent extends BaseComponent implements OnInit, OnDestroy {
    private authState$: Observable<IAuthState>;
    @ViewChild("signinForm") form: NgForm;
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
            } else if (state.signinStatus === "successNetwork") {
                this.router.navigate(["/"]);
            }
        });
    }

    public onSubmit(): void {
        this.isLoading = true;
        this.store.dispatch(actionCreators.signin(this.form.value.email, this.form.value.password));
    }

    public onDemoAccount(): void {
        this.isLoading = true;
        this.store.dispatch(actionCreators.signin("aguirrehebert@sensate.com", "password"));
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.store.dispatch(actionCreators.clearSigninStatus());
    }
}
