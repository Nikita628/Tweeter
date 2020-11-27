import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User, UserSearchParam } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../../common/base-component/base-component.component';
import { selectors as userSE } from "../../../state/user/reducer";
import { actionTypes as userAT, actionCreators as userAC } from "../../../state/user/actions";
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recommended-users',
  templateUrl: './recommended-users.component.html',
  styleUrls: ['./recommended-users.component.css']
})
export class RecommendedUsersComponent extends BaseComponent implements OnInit {
  private readonly listKey = "recommended";
  private users$: Observable<{ users: User[], totalCount: number }>;
  public users: User[] = [];

  constructor(protected store: Store<IAppState>) {
    super(store);
    this.users$ = store.select(userSE.list, this.listKey);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.users$.pipe(takeUntil(this.destroyed$))
      .subscribe(list => {
        this.users = list.users;
      });

    const param = new UserSearchParam();
    param.pageSize = 5;
    param.sortDirection = "desc";
    param.sortProp = "followersCount";
    param.notFolloweeOfUserId = this.currentUser.id;
    param.idNotEqual = this.currentUser.id;

    this.store.dispatch(userAC.search(param, this.listKey));
  }

  onFollow(userId: number): void {
    this.store.dispatch(userAC.follow(userId, this.listKey));
  }

  onUnfollow(userId: number): void {
    this.store.dispatch(userAC.unfollow(userId, this.listKey));
  }
}
