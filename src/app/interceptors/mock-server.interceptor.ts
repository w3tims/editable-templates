import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { defer, Observable, of } from 'rxjs';
import { mockTemplates } from '../mock-data/mock-templates.const';
import { delay } from 'rxjs/operators';
import { mockServerUrl } from '../consts/mock-server-url.const';

@Injectable()
export class MockServerInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return defer(() => {
      if (req.url === mockServerUrl) {
        return of(new HttpResponse({ body: mockTemplates}))
          .pipe(
            delay(2000)
          );
      } else {
        return next.handle(req);
      }
    });
  }
}

