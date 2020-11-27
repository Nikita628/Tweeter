import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HashTag } from 'src/app/models/HashTag';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../../common/base-component/base-component.component';
import { selectors as tweetSE } from "../../../state/tweet/reducer";
import { actionCreators as tweetAC } from "../../../state/tweet/actions";
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent extends BaseComponent implements OnInit, OnDestroy {
  public hashTags: HashTag[] = [];
  private hashTags$: Observable<HashTag[]>;

  constructor(protected store: Store<IAppState>) {
    super(store);
    this.hashTags$ = store.select(tweetSE.hashtags);
  }

  ngOnInit(): void {
    this.hashTags$.pipe(takeUntil(this.destroyed$))
      .subscribe(hashtags => this.hashTags = hashtags);

    this.store.dispatch(tweetAC.searchHashtags());
  }

}
