import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidemenuItem } from 'src/app/models/SidemenuItem';
import { TweetSearchParam } from 'src/app/models/Tweet';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent extends BaseComponent implements OnInit, OnDestroy {
  public filter: "tweets" | "tweetsAndReplies" | "media" | "likes";
  public menuItems: SidemenuItem[];
  public readonly feedKey = "bookmarks";
  public param: TweetSearchParam;

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
      this.param = param;
    });
  }

  private createSearchParam(filter: string): TweetSearchParam {
    const newParam = new TweetSearchParam();
    newParam.pageSize = 10;
    newParam.sortDirection = "desc";
    newParam.bookmarkedByUserId = this.currentUser.id;

    if (filter === "tweetsAndReplies") {
      newParam.onlyWithComments = true;
    } else if (filter === "media") {
      newParam.onlyWithMedia = true;
    } else if (filter === "likes") {
      newParam.onlyLikedByUserId = this.currentUser.id;
    }

    return newParam;
  }

  private createSideMenuItems(): SidemenuItem[] {
    const items: SidemenuItem[] = [];
    items.push(new SidemenuItem("Tweets", "/bookmarks/tweets"));
    items.push(new SidemenuItem("Tweets & Replies", "/bookmarks/tweets-and-replies"));
    items.push(new SidemenuItem("Media", "/bookmarks/media"));
    items.push(new SidemenuItem("Likes", "/bookmarks/likes"));
    return items;
  }

}
