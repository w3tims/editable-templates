import { Component, OnInit } from '@angular/core';
import { TemplatesStateService } from '../../services/templates-state.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {

  templates$ = this.templatesStateService.templates$;

  templatesLoading$ = this.templatesStateService.templatesLoading$;
  templatesLoadingSuccess$ = this.templatesStateService.templatesLoadingSuccess$;
  templatesLoadingError$ = this.templatesStateService.templatesLoadingError$;

  constructor(
    private templatesStateService: TemplatesStateService
  ) { }

  ngOnInit() {
    this.templatesStateService.loadTemplates(true);
  }

  getErrorText(error: any) {
    if (typeof error === 'string') {
      return error;
    }
    return 'Error!';
  }

  getReadableDateTimeFromUtc(utc: number) {
    if (!utc) { return ''; }
    const dateValue = new Date(utc);

    const date = this.twoDigit(dateValue.getDate());
    const month = this.twoDigit(dateValue.getMonth() + 1);
    const year = dateValue.getFullYear();

    const hours = this.twoDigit(dateValue.getHours());
    const minutes = this.twoDigit(dateValue.getMinutes());
    const seconds = this.twoDigit(dateValue.getSeconds());

    return `${date}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  twoDigit(val: string | number) {
    return ('0' + val).slice(-2);
  }

}
