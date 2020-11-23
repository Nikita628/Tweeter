import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IActionStatuses } from 'src/app/models/Common';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { selectors as commonSE } from "../../../state/common";

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponent implements OnInit, OnDestroy {
  protected destroyed$ = new Subject();
  protected actionStatuses$: Observable<IActionStatuses>;
  public currentUser: User;

  constructor(protected store: Store<IAppState>) {
    this.actionStatuses$ = store.select(commonSE.actionStatuses);
  }

  ngOnInit(): void {
    this.store.select("auth")
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => this.currentUser = state.user);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
