import { AtividadeCreateModalPage } from './atividade-create-modal';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    AtividadeCreateModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AtividadeCreateModalPage),
  ],
  exports: [
    AtividadeCreateModalPage
  ]
})

export class AtividadeCreatePageModule { }
