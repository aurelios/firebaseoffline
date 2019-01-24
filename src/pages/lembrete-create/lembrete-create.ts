import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lembrete } from '../lembrete/lembrete.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../providers/auth/auth-service';

@IonicPage()
@Component({
  selector: 'page-lembrete-create',
  templateUrl: 'lembrete-create.html',
})
export class LembreteCreatePage {
  @ViewChild('form') form: NgForm;
  public lembrete: Lembrete;  
  public tittle: string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private afs: AngularFirestore,
    private authService: AuthService) {
      this.tittle = this.navParams.get('tittle');
      this.lembrete = this.navParams.get('lembrete');
      if(this.lembrete === undefined)
        this.lembrete = {atividade: null, qtdDiasAviso : null} as Lembrete;
  }

  salvar(item: Lembrete) {
    if (this.form.form.valid) {      
      
      this. authService.getUser().subscribe(
        user => {
          const id = (item.id == undefined ? this.afs.createId() :  item.id);
          if(item.id == undefined){
            this.afs.collection(user.email).doc("entrys").collection<Lembrete>("lembrete").add(item);
          } else {
            this.afs.collection(user.email).doc("entrys").collection<Lembrete>("lembrete").doc(item.id).update(item);
          }
          
          this.navCtrl.pop();
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LembreteCreatePage');
  }
}




