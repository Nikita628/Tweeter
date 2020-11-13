import { Component, OnInit } from "@angular/core";
import { Store } from '@ngrx/store';
import { IAppState } from './state';
import { actionCreators } from './state/auth';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(private store: Store<IAppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(actionCreators.autoSignin());
  }
}
