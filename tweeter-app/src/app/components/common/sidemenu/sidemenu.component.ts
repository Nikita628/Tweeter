import { Component, Input, OnInit } from '@angular/core';
import { SidemenuItem } from 'src/app/models/SidemenuItem';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  @Input() items: SidemenuItem[];

  constructor() { }

  ngOnInit(): void {
  }

}
