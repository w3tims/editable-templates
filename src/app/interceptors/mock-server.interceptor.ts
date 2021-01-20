import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, defer, Observable, of } from 'rxjs';
import { mockTemplates } from '../mock-data/mock-templates.const';
import { delay } from 'rxjs/operators';
import { mockServerUrl } from '../consts/mock-server-url.const';
import { ITemplate } from '../typings/interfaces/template.interface';

@Injectable()
export class MockServerInterceptor implements HttpInterceptor {

  templates$ = new BehaviorSubject<ITemplate[]>(mockTemplates);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return defer(() => {
      if (req.url === mockServerUrl) {
        if (req.method === 'GET') {
          return of(new HttpResponse({ body: this.templates$.value }))
            .pipe(
              delay(2000)
            );
        }
        if (req.method === 'PATCH') {
          const templates = this.templates$.value;
          let updatedTemplate = req.body as ITemplate;
          const updatedTemplates = templates.map(template => {
            if (template.id === updatedTemplate.id) {
              updatedTemplate = { ...template, ...updatedTemplate, modified: (new Date().getTime()) };
              return updatedTemplate;
            }
            return template;
          });
          this.templates$.next(updatedTemplates);

          return of(new HttpResponse({ body: updatedTemplate}))
            .pipe(
              delay(2000)
            );
        }
      }

      return next.handle(req);
    });
  }
}

