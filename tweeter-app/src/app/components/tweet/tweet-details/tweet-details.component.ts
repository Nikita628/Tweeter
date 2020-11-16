import { Component, Input, OnInit } from '@angular/core';
import { Tweet } from 'src/app/models/Tweet';

@Component({
  selector: 'app-tweet-details',
  templateUrl: './tweet-details.component.html',
  styleUrls: ['./tweet-details.component.css']
})
export class TweetDetailsComponent implements OnInit {
  @Input() tweet: Tweet;

  constructor() { }

  ngOnInit(): void {
  }

}
