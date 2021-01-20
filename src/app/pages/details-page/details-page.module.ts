import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsPageComponent } from './details-page.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SafePipe } from './safe.pipe';



@NgModule({
  declarations: [DetailsPageComponent, SafePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: DetailsPageComponent,
    }])
  ],
  entryComponents: [
  ]
})
export class DetailsPageModule { }
