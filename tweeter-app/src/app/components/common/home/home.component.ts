import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TweetSearchParam } from 'src/app/models/Tweet';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  public feedKey = "home";
  public param = new TweetSearchParam();

  constructor(protected store: Store<IAppState>) {
    super(store);
    this.param.pageSize = 10;
    this.param.sortDirection = "desc";
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.param.appendToExistingStorePage = false;
    this.param.followerId = this.currentUser.id;
    this.param.createdById = this.currentUser.id;
    this.param.createdByIdOrFollowerId = true;
  }
}
