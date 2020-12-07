import { Injectable } from "@angular/core";

@Injectable()
export class ScrollPositionService {
    private positions: { [name: string]: number } = {};

    constructor() {

    }

    public setPosition(name: string, position: number): void {
        this.positions[name] = position;
    }

    public scrollToPosition(name: string): void {
        if (this.positions[name]) {
            setTimeout(() => {
                window.scrollTo(0, this.positions[name]);
                this.positions[name] = null;
            });
        }
    }

    public scrollToTop(): void {
        window.scrollTo(0, 0);
    }
}
