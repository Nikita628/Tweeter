import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tweet-creation',
  templateUrl: './tweet-creation.component.html',
  styleUrls: ['./tweet-creation.component.css']
})
export class TweetCreationComponent implements OnInit {
  @ViewChild("imgPreviewEl") imgPreviewEl: ElementRef<HTMLImageElement>;
  public selectedImg: File;

  constructor() { }

  ngOnInit(): void {
  }

  public onFileSelected(files: File[]): void {
    this.selectedImg = files[0];
    this.imgPreviewEl.nativeElement.src = URL.createObjectURL(this.selectedImg);
  }
}
