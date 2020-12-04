import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User, UserSearchParam } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../../common/base-component/base-component.component';
import { selectors as userSE } from "../../../state/user/reducer";
import { actionCreators as userAC } from "../../../state/user/actions";
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() listKey: string;
  @Input() param: UserSearchParam;

  private list$: Observable<{ users: User[], totalCount: number }>;
  private pageNumber: number;

  public users: User[] = [];
  public totalCount = 0;

  constructor(protected store: Store<IAppState>) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.list$ = this.store.select(userSE.list, this.listKey);

    this.list$.pipe(takeUntil(this.destroyed$))
      .subscribe(list => {
        this.users = list.users;
        this.totalCount = list.totalCount;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pageNumber = this.param.pageNumber;
    this.store.dispatch(userAC.search(this.param, this.listKey));
  }

  public onFollow(userId: number): void {
    this.store.dispatch(userAC.follow(userId, this.listKey));
  }

  public onUnfollow(userId: number): void {
    this.store.dispatch(userAC.unfollow(userId, this.listKey));
  }

  public onLoadMore(): void {
    const newParam: UserSearchParam = {
      ...this.param,
      pageNumber: ++this.pageNumber,
      appendToExistingStorePage: true,
    };

    this.store.dispatch(userAC.search(newParam, this.listKey));
  }
}
