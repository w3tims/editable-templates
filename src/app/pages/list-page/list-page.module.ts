import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPageComponent } from './list-page.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [ListPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: ListPageComponent,
    }])
  ]
})
export class ListPageModule { }
