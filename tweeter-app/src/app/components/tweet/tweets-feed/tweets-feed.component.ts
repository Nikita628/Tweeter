import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tweet, TweetSearchParam } from 'src/app/models/Tweet';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { actionCreators, selectors } from 'src/app/state/tweet';

@Component({
  selector: 'app-tweets-feed',
  templateUrl: './tweets-feed.component.html',
  styleUrls: ['./tweets-feed.component.css']
})
export class TweetsFeedComponent implements OnInit, OnDestroy {
  @Input() feedKey: string;
  private destroyed$ = new Subject();
  private feed$: Observable<{tweets: Tweet[], totalCount: number}>;
  private currentUser: User;
  private param = new TweetSearchParam();
  private scrollY = 0;
  private lastId: number;

  public totalCount = 0;
  public tweets: Tweet[] = [];

  constructor(private store: Store<IAppState>) {
    this.param.pageSize = 10;
    this.param.sortDirection = "desc";
  }

  ngOnInit(): void {
    this.feed$ = this.store.select(selectors.feed, this.feedKey);

    this.feed$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((feed) => {
      if (feed?.tweets?.length) {
        this.tweets = feed.tweets;
        this.lastId = feed.tweets[feed.tweets.length - 1].id;
      }

      if (feed?.totalCount && !this.totalCount) {
        this.totalCount = feed.totalCount;
      }

      if (this.scrollY) {
        window.scrollTo(0, this.scrollY);
      }
    });

    this.store.select("auth")
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => this.currentUser = state.user);

    this.param.appendToExistingStorePage = false;
    this.param.followerId = this.currentUser.id;
    this.param.createdById = this.currentUser.id;
    this.param.createdByIdOrFollowerId = true;

    this.store.dispatch(actionCreators.search(this.param, this.feedKey));
  }

  public onLoadMore(): void {
    this.scrollY = window.scrollY;

    const param: TweetSearchParam = {
      ...this.param,
      idLessThan: this.lastId,
      appendToExistingStorePage: true,
    };

    this.store.dispatch(actionCreators.search(param, this.feedKey));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

