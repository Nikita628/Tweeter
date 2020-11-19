import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  public isOpened = false;

  constructor() { }

  ngOnInit(): void {
  }

  public toggle(): void {
    this.isOpened = !this.isOpened;
  }
}
