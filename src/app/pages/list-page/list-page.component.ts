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
    this.templatesStateService.loadTemplates(false);
  }

  getErrorText(error: any) {
    if (typeof error === 'string') {
      return error;
    }
    return 'Error!';
  }

}
