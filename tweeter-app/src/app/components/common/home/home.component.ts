import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/state';
import { actionCreators } from 'src/app/state/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private store: Store<IAppState>) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.store.dispatch(actionCreators.signout());
  }
}
