import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Tweet, TweetSearchParam } from 'src/app/models/Tweet';
import { IAppState } from 'src/app/state';
import { actionCreators as tweetAC, selectors as tweetSE } from 'src/app/state/tweet';
import { BaseComponent } from '../../common/base-component/base-component.component';

@Component({
  selector: 'app-tweets-feed',
  templateUrl: './tweets-feed.component.html',
  styleUrls: ['./tweets-feed.component.css']
})
export class TweetsFeedComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() feedKey: string;
  private feed$: Observable<{tweets: Tweet[], totalCount: number}>;
  private param = new TweetSearchParam();
  private scrollY = 0;
  private lastId: number;

  public totalCount = 0;
  public tweets: Tweet[] = [];

  constructor(protected store: Store<IAppState>) {
    super(store);
    this.param.pageSize = 10;
    this.param.sortDirection = "desc";
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.feed$ = this.store.select(tweetSE.feed, this.feedKey);

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

    this.param.appendToExistingStorePage = false;
    this.param.followerId = this.currentUser.id;
    this.param.createdById = this.currentUser.id;
    this.param.createdByIdOrFollowerId = true;

    this.store.dispatch(tweetAC.search(this.param, this.feedKey));
  }

  public onLoadMore(): void {
    this.scrollY = window.scrollY;

    const param: TweetSearchParam = {
      ...this.param,
      idLessThan: this.lastId,
      appendToExistingStorePage: true,
    };

    this.store.dispatch(tweetAC.search(param, this.feedKey));
  }
}

