import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LembreteCreatePage } from './lembrete-create';

@NgModule({
  declarations: [
    LembreteCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(LembreteCreatePage),
  ],
})
export class LembreteCreatePageModule {}
