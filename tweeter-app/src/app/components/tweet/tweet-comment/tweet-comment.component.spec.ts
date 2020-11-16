import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetCommentComponent } from './tweet-comment.component';

describe('TweetCommentComponent', () => {
  let component: TweetCommentComponent;
  let fixture: ComponentFixture<TweetCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TweetCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
