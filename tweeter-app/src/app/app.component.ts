import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IAppState } from './state';
import { actionCreators, IAuthState } from './state/auth';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  private authState$: Observable<IAuthState>;

  constructor(
    private store: Store<IAppState>,
    private router: Router
  ) {
    this.authState$ = store.select("auth");
  }

  ngOnInit(): void {
    const urlAfterSignin = window.location.pathname;

    this.authState$
      .pipe(
        takeUntil(this.destroyed$),
        filter(state => state.signinStatus === "errorLocal" || state.signinStatus === "successLocal")
      )
      .subscribe((authState) => {
        console.log("app auth state, urlaftersign", authState, urlAfterSignin);
        if (authState.signinStatus === "successLocal") {
          this.router.navigate([urlAfterSignin]);
        } else if (authState.signinStatus === "errorLocal") {
          this.router.navigate(["/signin"]);
        }
      });

    this.store.dispatch(actionCreators.autoSignin());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
