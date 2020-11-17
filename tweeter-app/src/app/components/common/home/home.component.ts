import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Tweet } from 'src/app/models/Tweet';
import { User } from 'src/app/models/User';
import { IAppState } from 'src/app/state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public tweets: Tweet[];

  constructor(private store: Store<IAppState>) {
    const tt = new Tweet();
    const uu = new User();
    uu.avatarUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    uu.name = "User Name";

    tt.isBookmarkedByCurrentUser = true;
    tt.bookmarkCount = 3;
    tt.commentCount = 4;
    tt.createdAt = new Date();
    tt.createdBy = uu;
    tt.imgUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    tt.isBookmarkedByCurrentUser = true;
    tt.isCommentedByCurrentUser = true;
    tt.isLikedByCurrentUser = true;
    tt.isRetweetedByCurrentUser = true;
    tt.likeCount = 2;
    tt.retweetCount = 3;
    tt.text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, quod! Magnam laboriosam ad";


    const t = new Tweet();
    const u = new User();
    u.avatarUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    u.name = "User Name";

    t.retweetedFromId = 2;
    t.originalTweet = tt;
    t.bookmarkCount = 3;
    t.commentCount = 4;
    t.createdAt = new Date();
    t.createdBy = u;
    t.imgUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    t.isBookmarkedByCurrentUser = true;
    t.isCommentedByCurrentUser = true;
    t.isLikedByCurrentUser = true;
    t.likeCount = 2;
    t.retweetCount = 3;
    t.text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, quod! Magnam laboriosam ad";
    this.tweets = [];
    this.tweets.push(t);
  }

  ngOnInit(): void {
  }

}
