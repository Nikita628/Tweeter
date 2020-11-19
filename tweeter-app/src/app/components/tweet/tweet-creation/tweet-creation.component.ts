import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tweet-creation',
  templateUrl: './tweet-creation.component.html',
  styleUrls: ['./tweet-creation.component.css']
})
export class TweetCreationComponent implements OnInit {
  @ViewChild("imgPreviewEl") imgPreviewEl: ElementRef<HTMLImageElement>;
  public selectedImg: File;
  public tweetText: string;
  public onlyFollowedCanReply = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onFileSelected(files: File[]): void {
    this.selectedImg = files[0];
    this.imgPreviewEl.nativeElement.src = URL.createObjectURL(this.selectedImg);
  }

  public onTweet(): void {
    // dispatch
  }

  public onVisibilityChanged(onlyFollowedCanReply: boolean): void {
    this.onlyFollowedCanReply = onlyFollowedCanReply;
  }
}
