import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';

import { SidemenuItem } from 'src/app/models/SidemenuItem';
import { TweetSearchParam } from 'src/app/models/Tweet';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../../common/base-component/base-component.component';
import { actionCreators as userAC } from "../../../state/user/actions";
import { selectors as userSE } from "../../../state/user/reducer";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent implements OnInit, OnDestroy {
  public dataFilter: "tweets" | "tweetsAndReplies" | "media" | "likes";
  public menuItems: SidemenuItem[];
  public readonly feedKey = "profile";
  public param: TweetSearchParam;
  public user: User;
  private userId: number;

  constructor(
    private route: ActivatedRoute,
    protected store: Store<IAppState>,
  ) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.params
      .pipe(
        takeUntil(this.destroyed$),
        withLatestFrom(this.route.data),
      )
      .subscribe(([params, data]) => {
        this.userId = +params.id;
        this.store.dispatch(userAC.get(this.userId));
        const param = this.createSearchParam(data.filter);
        this.param = param;
        this.menuItems = this.createSideMenuItems();
      });

    this.route.data
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataFilter = data.filter;
        const param = this.createSearchParam(data.filter);
        this.param = param;
      });

    this.store.select(userSE.user)
      .pipe(
        takeUntil(this.destroyed$),
        filter(user => !!user),
      )
      .subscribe(user => {
        this.user = user;
      });
  }

  private createSearchParam(dataFilter: string): TweetSearchParam {
    const newParam = new TweetSearchParam();
    newParam.pageSize = 10;
    newParam.sortDirection = "desc";
    newParam.createdById = this.userId;

    if (dataFilter === "tweetsAndReplies") {
      newParam.onlyWithComments = true;
    } else if (dataFilter === "media") {
      newParam.onlyWithMedia = true;
    } else if (dataFilter === "likes") {
      newParam.createdById = null;
      newParam.onlyLikedByUserId = this.userId;
    }

    return newParam;
  }

  onFollow(userId: number): void {
    this.store.dispatch(userAC.follow(userId, null));
  }

  onUnfollow(userId: number): void {
    this.store.dispatch(userAC.unfollow(userId, null));
  }

  private createSideMenuItems(): SidemenuItem[] {
    const items: SidemenuItem[] = [];
    items.push(new SidemenuItem("Tweets", `/profile/${this.userId}/tweets`));
    items.push(new SidemenuItem("Tweets & Replies", `/profile/${this.userId}/tweets-and-replies`));
    items.push(new SidemenuItem("Media", `/profile/${this.userId}/media`));
    items.push(new SidemenuItem("Likes", `/profile/${this.userId}/likes`));
    return items;
  }

}
