import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-recommended-users',
  templateUrl: './recommended-users.component.html',
  styleUrls: ['./recommended-users.component.css']
})
export class RecommendedUsersComponent implements OnInit {

  public users: User[] = [];

  constructor() {
    const a = new User();
    a.avatarUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    a.name = "User Name";
    a.profileCoverUrl = "https://www.familyfriendpoems.com/images/hero/large/nature-beauty.jpg";
    a.followersCount = 235;
    a.about = "sfsdfsd dsfsdfsd lknkm lsdfsdf lknsdlfknskdfn slkdfnskdnf slkfnslkn";

    this.users.push(a, a);
  }

  ngOnInit(): void {
  }

}
