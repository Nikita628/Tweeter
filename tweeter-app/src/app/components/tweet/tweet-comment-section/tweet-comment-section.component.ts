import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IActionStatuses, Notifier } from 'src/app/models/Common';
import { Tweet } from 'src/app/models/Tweet';
import { TweetComment, TweetCommentSearchParam } from 'src/app/models/TweetComment';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { selectors as tweetCommentSelectors } from 'src/app/state/tweet-comment';
import { actionCreators, actionTypes } from "../../../state/tweet-comment";

@Component({
  selector: 'app-tweet-comment-section',
  templateUrl: './tweet-comment-section.component.html',
  styleUrls: ['./tweet-comment-section.component.css']
})
export class TweetCommentSectionComponent implements OnInit, OnDestroy {
  @ViewChild("imgPreviewElement") imgPreviewElement: ElementRef<HTMLImageElement>;
  @Input() tweet: Tweet;
  @Input() feedKey: string;
  @Input() notifier: Notifier;
  private destroyed$ = new Subject();
  private comments$: Observable<{ comments: TweetComment[], totalCount: number }>;
  private actionStatuses$: Observable<IActionStatuses>;
  private lastId: number;
  private param = new TweetCommentSearchParam();
  private isInited = false;

  public selectedImg: File;
  public commentText: string;
  public comments: TweetComment[] = [];
  public totalCount = 0;
  public currentUser: User;

  constructor(private store: Store<IAppState>) {
    this.param.sortDirection = "desc";
    this.param.pageSize = 10;
  }

  ngOnInit(): void {
    this.actionStatuses$ = this.store.select(tweetCommentSelectors.actionStatuses);
    this.comments$ = this.store.select(tweetCommentSelectors.tweetComments, { feedKey: "home", tweetId: this.tweet.id });

    this.store.select("auth")
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => this.currentUser = state.user);

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
        if (state[actionTypes.create] === "success") {
          this.selectedImg = null;
          this.commentText = null;
          this.imgPreviewElement.nativeElement.src = "";
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

      this.store.dispatch(actionCreators.create(newComment, this.feedKey));
    }
  }

  public onLoadMore(): void {
    this.param.idLessThan = this.lastId;
    this.param.tweetId = this.tweet.id;
    this.store.dispatch(actionCreators.search(this.param, this.feedKey));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
