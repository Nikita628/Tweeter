import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { actionCreators } from 'src/app/state/auth';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.css']
})
export class TopmenuComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  public isMenuOpened = false;
  public user: User;

  constructor(
    private store: Store<IAppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.store.select("auth").pipe(
      takeUntil(this.destroyed$)
    ).subscribe(state => {
      this.user = state.user;
    });
  }

  public toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  public logout(e: MouseEvent): void {
    e.preventDefault();
    this.store.dispatch(actionCreators.signout());
  }

  public navigateHome(): void {
    this.router.navigate(["/"]);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
