import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteKey } from './typings/enums/route-key.enum';


const routes: Routes = [{
  path: ``,
  loadChildren: () => import('./pages/list-page/list-page.module').then(mod => mod.ListPageModule),
}, {
  path: `:${RouteKey.templateId}`,
  loadChildren: () => import('./pages/details-page/details-page.module').then(mod => mod.DetailsPageModule),
}, {
  path: '**',
  redirectTo: '',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
