import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shorten' })
export class NumberShortenerPipe implements PipeTransform {
    transform(value: number): string {
        if (!value && value !== 0) { return ""; }

        if (value < 1000) {
            return value.toString();
        } else if (value < 1_000_000) {
            return (value / 1000).toFixed(1) + "K";
        } else if (value < 1_000_000_000) {
            return (value / 1_000_000).toFixed(1) + "M";
        }
    }
}
