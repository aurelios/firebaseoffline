import { AtividadeCreatePage } from './atividade-create';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    AtividadeCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(AtividadeCreatePage),
  ],
  exports: [
    AtividadeCreatePage
  ]
})

export class AtividadeCreatePageModule { }
