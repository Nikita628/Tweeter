import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class ApiClient {
    constructor(protected http: HttpClient) {

    }
}
