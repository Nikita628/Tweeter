import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { IAppState } from '../../state';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private store: Store<IAppState>) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select("auth").pipe(
            take(1),
            exhaustMap((authState) => {
                const authHeader = "Bearer " + authState.token;
                const updatedReq = req.clone({ headers: new HttpHeaders().set("Authorization", authHeader) });
                return next.handle(updatedReq);
            })
        );
    }
}
