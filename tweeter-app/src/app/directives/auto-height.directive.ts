import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appAutoHeight]'
})
export class AutoHeightDirective {
    @Input() appAutoHeight = 0;

    constructor(private el: ElementRef<HTMLTextAreaElement>) { }

    @HostListener("input") onInput(): void {
        this.el.nativeElement.style.height = "0";
        const currentHeight = this.el.nativeElement.scrollHeight;
        this.el.nativeElement.style.height = (this.appAutoHeight + currentHeight) + "px";
    }
}
