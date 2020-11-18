import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Tweet } from 'src/app/models/Tweet';
import { TweetCommentSectionComponent } from '../tweet-comment-section/tweet-comment-section.component';

@Component({
  selector: 'app-tweet-details',
  templateUrl: './tweet-details.component.html',
  styleUrls: ['./tweet-details.component.css']
})
export class TweetDetailsComponent implements OnInit {
  @ViewChild("commentSection") commentSection: ElementRef<TweetCommentSectionComponent>;
  @Input() tweet: Tweet;

  constructor() { }

  ngOnInit(): void {
  }

  public onSendComment(): void {
    this.commentSection.nativeElement.sendComment();
  }

  public onRetweet(tweetId: number): void {

  }

  public onLike(tweetId: number): void {

  }

  public onBookmark(tweetId: number): void {

  }
}
