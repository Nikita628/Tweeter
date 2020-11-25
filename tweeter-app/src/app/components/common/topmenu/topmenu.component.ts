import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/state';
import { actionCreators as authAC } from '../../../state/auth/actions';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.css']
})
export class TopmenuComponent extends BaseComponent implements OnInit, OnDestroy {
  public isMenuOpened = false;

  constructor(
    protected store: Store<IAppState>,
    private router: Router
  ) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  public logout(e: MouseEvent): void {
    e.preventDefault();
    this.store.dispatch(authAC.signout());
  }

  public navigateHome(): void {
    this.router.navigate(["/"]);
  }
}
