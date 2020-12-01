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
  @Input() useLastIdForPaging: boolean;

  private feed$: Observable<{tweets: Tweet[], totalCount: number}>;
  private scrollY: number;
  private lastId: number;
  private pageNumber: number;

  public totalCountForPaging = 0;
  public totalCountForLastId = 0;
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
      this.tweets = feed.tweets;

      if (this.useLastIdForPaging) {
        if (!this.totalCountForLastId) {
          this.totalCountForLastId = feed.totalCount;
        }

        if (feed.tweets.length) {
          this.lastId = feed.tweets[feed.tweets.length - 1].id;
        }
      }

      if (!this.useLastIdForPaging) {
        this.totalCountForPaging = feed.totalCount;
      }

      if (this.scrollY) {
        // TODO scroll only after search action completed
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

    if (this.useLastIdForPaging) {
      param.idLessThan = this.lastId;
    } else {
      param.pageNumber = ++this.pageNumber;
    }

    this.store.dispatch(tweetAC.search(param, this.feedKey));
  }
}

