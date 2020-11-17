import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  @Input() imgUrl: string;
  @Input() width: number;
  @Input() height: number;
  @Input() header: string;
  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
  }

}
