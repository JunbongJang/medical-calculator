import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full'},
  { path: 'homepage', component: HomePageComponent, data: { state: 'homepage' }},
  // { path: 'page-not-found', component: PageNotFoundComponent },

  // routes get parsed from top to bottom so  always put this double asterisk at the end
  { path: '**', redirectTo: '/page-not-found' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
