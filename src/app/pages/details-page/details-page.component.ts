import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TemplatesStateService } from '../../services/templates-state.service';
import { ActivatedRoute } from '@angular/router';
import { delayWhen, filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { RouteKey } from '../../typings/enums/route-key.enum';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ITemplate } from '../../typings/interfaces/template.interface';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss']
})
export class DetailsPageComponent implements OnInit, AfterViewInit, AfterViewChecked {

  subscriptions: Subscription[] = [];

  viewChecked$ = new EventEmitter();
  template$ = new BehaviorSubject<ITemplate>(null);
  selectedElement$ = new BehaviorSubject<HTMLElement>(null);

  textControl = new FormControl('');
  fontSizeControl = new FormControl(null);

  editPanelForm = new FormGroup({
    text: this.textControl,
    fontSize: this.fontSizeControl,
  });

  @ViewChild('templateContainer', {read: ElementRef, static: false}) templateContainer: ElementRef;

  templateId$ = this.activatedRoute.params.pipe(
    map(params => params && params[RouteKey.templateId]),
    filter(templateId => Boolean(templateId)),
  );

  constructor(
    private templatesStateService: TemplatesStateService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.templatesStateService.loadTemplates(false);
    this.subscriptions.push(

      this.templateId$.pipe(
        mergeMap(templateId => this.templatesStateService.getTemplateById$(templateId)),
        tap(template => this.template$.next(template)),
        filter(template => Boolean(template)),
        first(),
      ).subscribe(),

      this.selectedElement$.pipe(
        tap(selectedElement => this.updateEditPanelFormValue(selectedElement))
      ).subscribe(),

      this.editPanelForm.valueChanges.pipe(
          tap(({ text, fontSize }) => {

            this.selectedElement$.value.innerHTML = text;
            if (fontSize) {
              this.selectedElement$.value
                .setAttribute('style', `font-size: ${fontSize}px`);
            }
          }),
          mergeMap(() => {
            const innerHtml = (this.templateContainer.nativeElement as HTMLElement).innerHTML;
            return this.templatesStateService.editTemplate$({ ...this.template$.value, template: innerHtml });
          }),
      ).subscribe()
    );

  }

  ngAfterViewInit() {
    this.template$.pipe(
      filter(template => Boolean(template)),
      delayWhen(() => this.viewChecked$),
      tap(() => this.enableEditing())
    ).subscribe();
  }

  ngAfterViewChecked() {
    this.viewChecked$.emit();
  }

  updateEditPanelFormValue(selectedElement: HTMLElement) {
    if (selectedElement) {
      const fontSize = window.getComputedStyle(selectedElement, null)
        .getPropertyValue('font-size')
        .split('px')[0];
      const text = selectedElement.innerText;
      this.editPanelForm.patchValue({fontSize, text}, { emitEvent: false });
    } else {
      this.editPanelForm.patchValue({fontSize: null, text: null}, { emitEvent: false });
    }
  }

  enableEditing() {
    const editableElements = this.templateContainer.nativeElement.querySelectorAll('.editable');
    editableElements
      .forEach((elem: HTMLElement) => fromEvent(elem, 'click')
      .subscribe(clickEvent => { this.selectedElement$.next(elem); }));
  }

}
