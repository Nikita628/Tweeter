import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tweet, TweetSearchParam } from 'src/app/models/Tweet';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { actionCreators, ITweetState, selectors } from 'src/app/state/tweet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly tweetListStoreKey = "homeTweets";
  private destroyed$ = new Subject();
  private homeTweets$: Observable<{tweets: Tweet[], totalCount: number}>;
  private currentUser: User;
  private param = new TweetSearchParam();
  private pageNumber = 1;
  private scrollY = 0;

  public totalCount = 0;
  public tweets: Tweet[] = [];

  constructor(private store: Store<IAppState>) {
    this.homeTweets$ = store.select(selectors.selectTweetList, this.tweetListStoreKey);
    this.param.pageNumber = this.pageNumber;
    this.param.pageSize = 10;
    this.param.sortDirection = "desc";
    this.param.sortProp = "createdAt";
  }

  ngOnInit(): void {
    this.homeTweets$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((state) => {
      this.tweets = state?.tweets;
      this.totalCount = state?.totalCount;
      if (this.scrollY) {
        window.scrollTo(0, this.scrollY);
      }
    });

    this.store.select("auth")
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => this.currentUser = state.user);

    this.param.appendToExistingStorePage = false;
    this.param.followerId = this.currentUser.id;

    this.store.dispatch(actionCreators.search(this.param, this.tweetListStoreKey));
  }

  public onLoadMore(): void {
    this.scrollY = window.scrollY;
    this.pageNumber++;

    const param: TweetSearchParam = {
      ...this.param,
      pageNumber: this.pageNumber,
      appendToExistingStorePage: true,
    };

    this.store.dispatch(actionCreators.search(param, this.tweetListStoreKey));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
