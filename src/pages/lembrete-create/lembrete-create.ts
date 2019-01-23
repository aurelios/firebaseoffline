import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lembrete } from '../lembrete/lembrete.model';

/**
 * Generated class for the LembreteCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lembrete-create',
  templateUrl: 'lembrete-create.html',
})
export class LembreteCreatePage {
  public lembrete: Lembrete;  
  public tittle: string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {      
      this.tittle = this.navParams.get('tittle');
      this.lembrete = this.navParams.get('lembrete');
      if(this.lembrete === undefined)
        this.lembrete = {atividade: null, qtdDiasAviso : null} as Lembrete;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LembreteCreatePage');
  }

}
