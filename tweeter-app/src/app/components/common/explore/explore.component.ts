import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { SidemenuItem } from 'src/app/models/SidemenuItem';
import { TweetSearchParam } from 'src/app/models/Tweet';
import { UserSearchParam } from 'src/app/models/User';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent extends BaseComponent implements OnInit, OnDestroy {
  public filter: "top" | "media" | "people" | "latest";
  public menuItems: SidemenuItem[];
  public readonly feedKey = "explore";
  public tweetParam: TweetSearchParam;
  public userParam: UserSearchParam;
  public searchText: string;

  constructor(
    private route: ActivatedRoute,
    protected store: Store<IAppState>,
  ) {
    super(store);
    this.menuItems = this.createSideMenuItems();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.data.subscribe((data) => {
      this.filter = data.filter;
      const param = this.createSearchParam(data.filter);
      if (param instanceof TweetSearchParam) {
        this.tweetParam = param;
      } else if (param instanceof UserSearchParam) {
        this.userParam = param;
      }
    });
  }

  public onSearch(): void {
    const newParam = this.createSearchParam(this.filter);
    if (newParam instanceof TweetSearchParam) {
      newParam.textContains = this.searchText;
      this.tweetParam = newParam;
    } else if (newParam instanceof UserSearchParam) {
      newParam.nameContains = this.searchText;
      this.userParam = newParam;
    }
  }

  private createSearchParam(filter: string): TweetSearchParam | UserSearchParam {
    const newParam = new TweetSearchParam();
    newParam.pageSize = 10;
    newParam.sortDirection = "desc";

    if (filter === "top") {
      newParam.sortProp = "likeCount";
    } else if (filter === "latest") {
      newParam.sortProp = "id";
    } else if (filter === "media") {
      newParam.onlyWithMedia = true;
    } else if (filter === "people") {
      const userParam = new UserSearchParam();
      userParam.pageSize = 10;
      return userParam;
    }

    return newParam;
  }

  private createSideMenuItems(): SidemenuItem[] {
    const items: SidemenuItem[] = [];
    items.push(new SidemenuItem("Top", "/explore/top"));
    items.push(new SidemenuItem("Latest", "/explore/latest"));
    items.push(new SidemenuItem("Media", "/explore/media"));
    items.push(new SidemenuItem("People", "/explore/people"));
    return items;
  }
}
