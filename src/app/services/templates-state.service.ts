import { Injectable } from '@angular/core';
import { ITemplate } from '../typings/interfaces/template.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, first, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplatesStateService {

  defaultValue: ITemplate[] = [];

  templates$ = new BehaviorSubject<ITemplate[]>(this.defaultValue);
  templatesLoading$ = new BehaviorSubject(false);
  templatesLoadingSuccess$ = new BehaviorSubject(false);
  templatesLoadingError$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  loadTemplates(reloadIfLoaded = false) {
    if (!reloadIfLoaded && this.templatesLoadingSuccess$.value) {
      return;
    }

    this.templates$.next(this.defaultValue);
    this.templatesLoading$.next(true);
    this.templatesLoadingSuccess$.next(false);
    this.templatesLoadingError$.next(null);

    this.http.get<ITemplate[]>(environment.serverUrl)
      .pipe(
        first(),
        tap(res => {
          this.templates$.next(res);
          this.templatesLoading$.next(false);
          this.templatesLoadingSuccess$.next(true);
          this.templatesLoadingError$.next(null);
        }),
        catchError(err => {
          this.templates$.next(this.defaultValue);
          this.templatesLoading$.next(false);
          this.templatesLoadingSuccess$.next(false);
          this.templatesLoadingError$.next(err);
          return of(err);
        }),
      )
      .subscribe();
  }

  getTemplateById$(id: number | string): Observable<ITemplate> {
    return this.templates$.pipe(
      map(templates => templates.find(template => template.id === +id))
    );
  }

}
