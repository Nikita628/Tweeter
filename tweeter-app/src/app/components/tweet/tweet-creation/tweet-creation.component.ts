import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';

import { Tweet } from 'src/app/models/Tweet';
import { IAppState } from 'src/app/state';
import { actionCreators as tweetAC, actionTypes as tweetAT } from "../../../state/tweet/actions";
import { BaseComponent } from '../../common/base-component/base-component.component';

@Component({
  selector: 'app-tweet-creation',
  templateUrl: './tweet-creation.component.html',
  styleUrls: ['./tweet-creation.component.css']
})
export class TweetCreationComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild("imgPreviewElement") imgPreviewElement: ElementRef<HTMLImageElement>;
  public selectedImg: File;
  public tweetText: string;
  public onlyFollowedCanReply = false;
  public sending = false;

  constructor(protected store: Store<IAppState>) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.actionStatuses$
      .pipe(
        takeUntil(this.destroyed$),
        filter(statuses => !!statuses)
      )
      .subscribe(statuses => {
        if (statuses[tweetAT.create] === "success") {
          this.tweetText = null;
          this.selectedImg = null;
          this.imgPreviewElement.nativeElement.src = "";
          this.onlyFollowedCanReply = false;
          this.sending = false;
          super.clearActionStatus(tweetAT.create);
        } else if (statuses[tweetAT.create] === "progress") {
          this.sending = true;
        } else if (statuses[tweetAT.create] === "error") {
          this.sending = false;
          super.clearActionStatus(tweetAT.create);
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

    this.store.dispatch(tweetAC.create(newTweet));
  }

  public onVisibilityChanged(onlyFollowedCanReply: boolean): void {
    this.onlyFollowedCanReply = onlyFollowedCanReply;
  }
}
