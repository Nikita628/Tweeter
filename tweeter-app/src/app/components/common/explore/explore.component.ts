import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { SidemenuItem } from 'src/app/models/SidemenuItem';
import { TweetSearchParam } from 'src/app/models/Tweet';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent extends BaseComponent implements OnInit, OnDestroy {
  private filter: string;
  public menuItems: SidemenuItem[];
  public readonly feedKey = "explore";
  public param: TweetSearchParam;
  public searchText: string;

  constructor(
    private route: ActivatedRoute,
    protected store: Store<IAppState>,
  ) {
    super(store);
    this.menuItems = this.createSideMenuItems();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.filter = data.filter;
      this.param = this.createSearchParam(data.filter);
    });
  }

  public onSearch(): void {
    const newParam = this.createSearchParam(this.filter);
    newParam.textContains = this.searchText;
    this.param = newParam;
  }

  private createSearchParam(filter: string): TweetSearchParam {
    const newParam = new TweetSearchParam();
    newParam.pageSize = 10;
    newParam.sortDirection = "desc";

    if (filter === "top") {
      newParam.sortProp = "likeCount";
    } else if (filter === "latest") {
      newParam.sortProp = "id";
    } else if (filter === "media") {
      newParam.onlyWithMedia = true;
    }

    return newParam;
  }

  private createSideMenuItems(): SidemenuItem[] {
    const items: SidemenuItem[] = [];
    items.push(new SidemenuItem("Top", "/explore/top"));
    items.push(new SidemenuItem("Latest", "/explore/latest"));
    items.push(new SidemenuItem("Media", "/explore/media"));
    return items;
  }
}
