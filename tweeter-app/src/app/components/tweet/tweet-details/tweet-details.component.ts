import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { IActionStatuses, Notifier } from 'src/app/models/Common';
import { Tweet } from 'src/app/models/Tweet';
import { IAppState } from 'src/app/state';
import { actionCreators as tweetAC, actionTypes as tweetAT } from "../../../state/tweet/actions";
import { actionTypes as tweetCommentAT } from "../../../state/tweet-comment/actions";
import { BaseComponent } from '../../common/base-component/base-component.component';

@Component({
  selector: 'app-tweet-details',
  templateUrl: './tweet-details.component.html',
  styleUrls: ['./tweet-details.component.css']
})
export class TweetDetailsComponent extends BaseComponent implements OnInit {
  @Input() tweet: Tweet;
  @Input() feedKey: string;
  public notifier = new Notifier();
  public isRetweeting = false;
  public isCommenting = false;
  public isLiking = false;
  public isSaving = false;

  constructor(protected store: Store<IAppState>) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.actionStatuses$.pipe(takeUntil(this.destroyed$))
      .subscribe((statuses: IActionStatuses) => {
        if (statuses[tweetAT.like] === "success"
          || statuses[tweetAT.like] === "error") {
          this.isLiking = false;
        }

        if (statuses[tweetAT.retweet] === "success"
          || statuses[tweetAT.retweet] === "error") {
          this.isRetweeting = false;
        }

        if (statuses[tweetAT.bookmark] === "success"
          || statuses[tweetAT.bookmark] === "error") {
          this.isSaving = false;
        }

        if (statuses[tweetCommentAT.create] === "success"
          || statuses[tweetCommentAT.create] === "error") {
          this.isCommenting = false;
        }
      });
  }

  public onSendComment(): void {
    this.isCommenting = true;
    this.notifier.notifyListener();
  }

  public onRetweet(tweetId: number): void {
    if (!this.isRetweeting) {
      this.isRetweeting = true;
      this.store.dispatch(tweetAC.retweet(tweetId, this.feedKey));
    }
  }

  public onLike(tweetId: number): void {
    if (this.tweet.retweetedFromId) {
      if (!this.tweet.originalTweet.isLikedByCurrentUser && !this.isLiking) {
        this.isLiking = true;
        this.store.dispatch(tweetAC.like(tweetId, this.feedKey));
      }
    } else if (!this.tweet.isLikedByCurrentUser && !this.isLiking){
      this.isLiking = true;
      this.store.dispatch(tweetAC.like(tweetId, this.feedKey));
    }
  }

  public onBookmark(tweetId: number): void {
    if (this.tweet.retweetedFromId) {
      if (!this.tweet.originalTweet.isBookmarkedByCurrentUser && !this.isSaving) {
        this.isSaving = true;
        this.store.dispatch(tweetAC.bookmark(tweetId, this.feedKey));
      }
    } else if (!this.tweet.isBookmarkedByCurrentUser && !this.isSaving) {
      this.isSaving = true;
      this.store.dispatch(tweetAC.bookmark(tweetId, this.feedKey));
    }
  }
}
