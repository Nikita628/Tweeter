import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Notifier } from 'src/app/models/Common';
import { Tweet } from 'src/app/models/Tweet';
import { TweetComment, TweetCommentSearchParam } from 'src/app/models/TweetComment';
import { IAppState } from 'src/app/state';
import { selectors as tweetCommentSE } from 'src/app/state/tweet-comment/reducer';
import { actionCreators as tweetCommentAC, actionTypes as tweetCommentAT } from "../../../state/tweet-comment/actions";
import { BaseComponent } from '../../common/base-component/base-component.component';

@Component({
  selector: 'app-tweet-comment-section',
  templateUrl: './tweet-comment-section.component.html',
  styleUrls: ['./tweet-comment-section.component.css']
})
export class TweetCommentSectionComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild("imgPreviewElement") imgPreviewElement: ElementRef<HTMLImageElement>;
  @Input() tweet: Tweet;
  @Input() feedKey: string;
  @Input() notifier: Notifier;
  private comments$: Observable<{ comments: TweetComment[], totalCount: number }>;
  private lastId: number;
  private param = new TweetCommentSearchParam();

  public selectedImg: File;
  public commentText: string;
  public comments: TweetComment[] = [];
  public totalCount = 0;

  constructor(protected store: Store<IAppState>) {
    super(store);
    this.param.sortDirection = "desc";
    this.param.pageSize = 10;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.comments$ = this.store.select(
      tweetCommentSE.tweetComments,
      { feedKey: this.feedKey, tweetId: this.tweet.retweetedFromId ? this.tweet.retweetedFromId : this.tweet.id }
    );

    this.comments$.pipe(
      takeUntil(this.destroyed$),
      filter(data => !!(data && data.comments && data.comments.length))
    ).subscribe((data) => {
      this.lastId = data.comments[data.comments.length - 1].id;
      this.comments = data.comments;
      this.totalCount = data.totalCount;
    });

    this.actionStatuses$.pipe(takeUntil(this.destroyed$))
      .subscribe(state => {
        if (state[tweetCommentAT.create] === "success") {
          this.selectedImg = null;
          this.commentText = null;
          if (this.imgPreviewElement?.nativeElement) {
            this.imgPreviewElement.nativeElement.src = "";
          }
        }
      });

    this.notifier.onEmit = () => this.sendComment();
  }

  public onFileSelected(files: File[]): void {
    this.selectedImg = files[0];
    this.imgPreviewElement.nativeElement.src = URL.createObjectURL(this.selectedImg);
  }

  public sendComment(): void {
    if (this.commentText) {
      const newComment = new TweetComment();
      newComment.tweetId = this.tweet.retweetedFromId ? this.tweet.retweetedFromId : this.tweet.id;
      newComment.img = this.selectedImg;
      newComment.text = this.commentText;

      this.store.dispatch(tweetCommentAC.create(newComment, this.feedKey));
    }
  }

  public onLoadMore(): void {
    this.param.idLessThan = this.lastId;
    this.param.tweetId = this.tweet.retweetedFromId ? this.tweet.retweetedFromId : this.tweet.id;
    this.store.dispatch(tweetCommentAC.search(this.param, this.feedKey));
  }

  public onLike(commentId: number): void {
    if (!this.comments.some(c => c.id === commentId && c.isLikedByCurrentUser)) {
      this.store.dispatch(tweetCommentAC.like(
        commentId,
        this.tweet.retweetedFromId ? this.tweet.retweetedFromId : this.tweet.id,
        this.feedKey
      ));
    }
  }
}
