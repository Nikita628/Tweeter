import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IActionStatuses } from 'src/app/models/Common';
import { Tweet } from 'src/app/models/Tweet';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';

import { actionCreators, actionTypes, selectors as tweetSelectors } from "../../../state/tweet";

@Component({
  selector: 'app-tweet-creation',
  templateUrl: './tweet-creation.component.html',
  styleUrls: ['./tweet-creation.component.css']
})
export class TweetCreationComponent implements OnInit, OnDestroy {
  @ViewChild("imgPreviewElement") imgPreviewElement: ElementRef<HTMLImageElement>;
  private destroyed$ = new Subject();
  private actionStatuses$: Observable<IActionStatuses>;
  public selectedImg: File;
  public tweetText: string;
  public onlyFollowedCanReply = false;
  public currentUser: User;
  public sending = false;

  constructor(private store: Store<IAppState>) { }

  ngOnInit(): void {
    this.actionStatuses$ = this.store.select(tweetSelectors.actionStatuses);
    this.store.select("auth").subscribe(state => this.currentUser = state.user);

    this.actionStatuses$
      .pipe(
        takeUntil(this.destroyed$),
        filter(statuses => !!statuses)
      )
      .subscribe(statuses => {
        if (statuses[actionTypes.create] === "success") {
          this.tweetText = null;
          this.selectedImg = null;
          this.imgPreviewElement.nativeElement.src = "";
          this.onlyFollowedCanReply = false;
          this.sending = false;
        } else if (statuses[actionTypes.create] === "progress") {
          this.sending = true;
        }
      });
  }

  public onFileSelected(files: File[]): void {
    this.selectedImg = files[0];
    this.imgPreviewElement.nativeElement.src = URL.createObjectURL(this.selectedImg);
  }

  public onTweet(): void {
    const newTweet = new Tweet();
    newTweet.img = this.selectedImg;
    newTweet.text = this.tweetText;
    newTweet.onlyFollowedCanReply = this.onlyFollowedCanReply;

    this.store.dispatch(actionCreators.create(newTweet));
  }

  public onVisibilityChanged(onlyFollowedCanReply: boolean): void {
    this.onlyFollowedCanReply = onlyFollowedCanReply;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
