import { Component, OnInit } from '@angular/core';
import { HashTag } from 'src/app/models/HashTag';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {
  public hashTags: HashTag[] = [];

  constructor() {
    const a = new HashTag();
    a.text = "lorem";
    a.tweetCount = 4;

    this.hashTags.push(a);
    this.hashTags.push(a);
  }

  ngOnInit(): void {
  }

}
