import { Component, OnInit } from '@angular/core';
import { TweetComment } from 'src/app/models/TweetComment';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-tweet-comment-section',
  templateUrl: './tweet-comment-section.component.html',
  styleUrls: ['./tweet-comment-section.component.css']
})
export class TweetCommentSectionComponent implements OnInit {
  public comments: TweetComment[] = [];
  public currentUser: User;

  constructor() {
    const uu = new User();
    uu.avatarUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    uu.name = "User Name";

    this.currentUser = uu;

    const a = new TweetComment();
    a.createdAt = new Date();
    a.createdBy = uu;
    a.id = 1;
    a.imgUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    a.isLikedByCurrentUser = true;
    a.likeCount = 8;
    a.text = "s;ldkfnsdlkfnsdlkfnsdlfkna;sdkfnsdpuivhjsiubnekj5n4p3iufhnskdnr34kj534kjnf3kj4r";
    a.tweetId = 10;

    const aa = new TweetComment();
    aa.createdAt = new Date();
    aa.createdBy = uu;
    aa.id = 2;
    aa.isLikedByCurrentUser = true;
    aa.likeCount = 8;
    aa.text = "s;ldkfnsdlkfnsdlkfnsdlfkna;sdkfnsdpuivhjsiubnekj5n4p3iufhnskdnr34kj534kjnf3kj4r";
    aa.tweetId = 10;

    this.comments.push(a, aa);
  }

  ngOnInit(): void {
  }

}
