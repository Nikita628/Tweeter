import { Component, Input, OnInit } from '@angular/core';
import { Notifier } from 'src/app/models/Common';
import { Tweet } from 'src/app/models/Tweet';

@Component({
  selector: 'app-tweet-details',
  templateUrl: './tweet-details.component.html',
  styleUrls: ['./tweet-details.component.css']
})
export class TweetDetailsComponent implements OnInit {
  @Input() tweet: Tweet;
  private notifier = new Notifier();

  constructor() { }

  ngOnInit(): void {
  }

  public onSendComment(): void {
    this.notifier.notifyListener();
  }

  public onRetweet(tweetId: number): void {

  }

  public onLike(tweetId: number): void {

  }

  public onBookmark(tweetId: number): void {

  }
}
