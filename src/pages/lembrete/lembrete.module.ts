import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LembretePage } from './lembrete';

@NgModule({
  declarations: [
    LembretePage,
  ],
  imports: [
    IonicPageModule.forChild(LembretePage),
  ],
})
export class LembretePageModule {}
