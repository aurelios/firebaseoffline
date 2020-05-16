import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AtividadeSelecaoPage } from './atividade-selecao';

@NgModule({
  declarations: [
    AtividadeSelecaoPage,
  ],
  imports: [
    IonicPageModule.forChild(AtividadeSelecaoPage),
  ],
  exports: [
    AtividadeSelecaoPage
  ]
})

export class AtividadeSelecaoPageModule { }
