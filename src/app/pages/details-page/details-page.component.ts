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
import { delayWhen, filter, map, mergeMap, tap } from 'rxjs/operators';
import { RouteKey } from '../../typings/enums/route-key.enum';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss']
})
export class DetailsPageComponent implements OnInit, AfterViewInit, AfterViewChecked {

  subscriptions: Subscription[] = [];

  viewChecked$ = new EventEmitter();
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

  selectedTemplate$ = this.templateId$.pipe(
    mergeMap(templateId => this.templatesStateService.getTemplateById$(templateId)),
    filter(selectedTemplate => Boolean(selectedTemplate))
  );

  constructor(
    private templatesStateService: TemplatesStateService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.templatesStateService.loadTemplates(false);
    this.subscriptions.push(
      this.selectedElement$.pipe(
        tap(selectedElement => this.updateEditPanelFormValue(selectedElement))
      ).subscribe(),

      this.editPanelForm.valueChanges
        .pipe(
          tap(({text, fontSize}) => {
            this.selectedElement$.value.innerText = text;
            if (fontSize) {
              this.selectedElement$.value
                .setAttribute('style', `font-size: ${fontSize}px`);
            }
            console.log('save:', (this.templateContainer.nativeElement as HTMLElement).innerHTML);
          })
        )
        .subscribe()

    );
  }

  ngAfterViewInit() {
    this.selectedTemplate$.pipe(
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
      this.editPanelForm.patchValue({fontSize, text});
    } else {
      this.editPanelForm.patchValue({fontSize: null, text: null});
    }
  }

  enableEditing() {
    // console.log('this.templateContainer.nativeElement', this.templateContainer.nativeElement);
    // const htmlContainer = this.templateContainer.nativeElement as HTMLElement;
    // const aa = const htmlContainer = this.templateContainer
    const editableElements = this.templateContainer.nativeElement.querySelectorAll('.editable');
    editableElements.forEach((elem: HTMLElement) => fromEvent(elem, 'click').subscribe(
      clickEvent => {
        console.log('clicked!!', clickEvent);
        this.selectedElement$.next(elem);
      }
    ));

      // .forEach((elem: HTMLElement) => {
      //   elem.contentEditable = 'true';
      //   // console.log('element:', elem);
      //   // const factory = this.componentFactoryResolver.resolveComponentFactory(PanelComponent);
      //   // const component = factory.create(this.injector);
      //   //
      //   // console.log('component', component);
      //   // elem.appendChild(component);
      //
      //
      //
      //   // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(KFTooltipComponent);
      //   // this.tooltipComponent = componentFactory.create(this.injector);
      //   // this.applicationRef.attachView(this.tooltipComponent.hostView);
      //   // document.body.appendChild(this.tooltipComponent.location.nativeElement);
      // });
  }

}
