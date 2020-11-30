import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Tweet, TweetSearchParam } from 'src/app/models/Tweet';
import { IAppState } from 'src/app/state';
import { actionCreators as tweetAC } from 'src/app/state/tweet/actions';
import { selectors as tweetSE } from "../../../state/tweet/reducer";
import { BaseComponent } from '../../common/base-component/base-component.component';

@Component({
  selector: 'app-tweets-feed',
  templateUrl: './tweets-feed.component.html',
  styleUrls: ['./tweets-feed.component.css']
})
export class TweetsFeedComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feedKey: string;
  @Input() param: TweetSearchParam;
  @Input() useLastId: boolean;

  private feed$: Observable<{tweets: Tweet[], totalCount: number}>;
  private scrollY = 0;
  private lastId: number;
  private pageNumber: number;

  public totalCount = 0;
  public tweets: Tweet[] = [];

  constructor(protected store: Store<IAppState>) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.feed$ = this.store.select(tweetSE.feed, this.feedKey);

    this.feed$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((feed) => {
      if (feed.tweets.length) {
        this.tweets = feed.tweets;
        this.lastId = feed.tweets[feed.tweets.length - 1].id;
      }

      this.totalCount = feed.totalCount;

      if (this.scrollY) {
        window.scrollTo(0, this.scrollY);
      }
    });
  }

  ngOnChanges(): void {
    this.pageNumber = this.param.pageNumber;
    this.store.dispatch(tweetAC.search(this.param, this.feedKey));
  }

  public onLoadMore(): void {
    this.scrollY = window.scrollY;

    const param: TweetSearchParam = {
      ...this.param,
      appendToExistingStorePage: true,
    };

    if (this.useLastId) {
      param.idLessThan = this.lastId;
    } else {
      param.pageNumber = ++this.pageNumber;
    }

    this.store.dispatch(tweetAC.search(param, this.feedKey));
  }
}

