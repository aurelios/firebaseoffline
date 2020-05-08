
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinhadePlantioCreateModalPage } from './linhadeplantio-create-modal';

@NgModule({
  declarations: [
    LinhadePlantioCreateModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LinhadePlantioCreateModalPage),
  ],
  exports: [
    LinhadePlantioCreateModalPage
  ]
})

export class LinhadePlantioCreatePageModule { }
