import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notifier } from 'src/app/models/Common';
import { Tweet } from 'src/app/models/Tweet';
import { TweetComment } from 'src/app/models/TweetComment';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { selectors } from 'src/app/state/tweet';

@Component({
  selector: 'app-tweet-comment-section',
  templateUrl: './tweet-comment-section.component.html',
  styleUrls: ['./tweet-comment-section.component.css']
})
export class TweetCommentSectionComponent implements OnInit, OnDestroy {
  @ViewChild("imgPreviewEl") imgPreviewEl: ElementRef<HTMLImageElement>;
  @Input() tweetId: number;
  @Input() tweetListStoreKey: string;
  @Input() notifier: Notifier;
  private destroyed$ = new Subject();
  private tweets$: Observable<{ tweets: Tweet[], totalCount: number }>;

  public selectedImg: File;
  public commentText: string;
  public comments: TweetComment[] = [];
  public currentUser: User;

  constructor(private store: Store<IAppState>) {
    this.tweets$ = store.select(selectors.selectTweetList, this.tweetListStoreKey);
  }

  ngOnInit(): void {
    this.store.select("auth")
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => this.currentUser = state.user);

    this.tweets$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((state) => {
      const tweet = state.tweets.find(t => t.id === this.tweetId || t.retweetedFromId === this.tweetId);
      if (tweet.originalTweet && tweet.originalTweet.tweetComments.length) {
        this.comments = tweet.originalTweet.tweetComments;
      } else if (tweet.tweetComments.length) {
        this.comments = tweet.tweetComments;
      }
    });

    this.notifier.onEmit = () => this.sendComment();
  }

  public onFileSelected(files: File[]): void {
    this.selectedImg = files[0];
    this.imgPreviewEl.nativeElement.src = URL.createObjectURL(this.selectedImg);
  }

  public onCommentTextInput(text: string): void {
    this.commentText = text;
  }

  public sendComment(): void {
    if (this.commentText) {
      // dispatch
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
