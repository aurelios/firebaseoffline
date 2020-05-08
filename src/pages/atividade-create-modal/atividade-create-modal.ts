import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, IonicPage, Loading, ToastController, LoadingController} from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Atividade } from '../atividade/atividade.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth-service';

@IonicPage()
@Component({
  selector: 'page-hint-modal',
  templateUrl: 'atividade-create-modal.html'
})
export class AtividadeCreateModalPage {
  @ViewChild('form') form: NgForm;
  myParam: string;
  loading: Loading;
  private itemsCollection: AngularFirestoreCollection<Atividade>;
  item: Atividade = {atividade: 'A', descricao : '', data: new Date().toISOString()};

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    public viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    params: NavParams
  ) {
    this.myParam = params.get('myParam');
    this.authService.getUser().subscribe(
      user => {
        this.itemsCollection = this.afs.collection(user.email).doc("entrys").collection<Atividade>("atividades", ref => ref.orderBy('data', 'desc'));
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async addItem(item: Atividade) {
    
    if (this.form.form.valid) {
      await this.presentLoading();
      try{
        await this.itemsCollection.add(item);
      } catch(e){}
      this.presentToast('Atividade Cadastrada com Sucesso !');
          
      await this.loading.dismiss();
      this.dismiss();
    }
    
  }

  async presentLoading(){
    this.loading = await this._loadingCtrl.create({content: 'Por favor, aguarde...'});
    this.loading.present();
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({message, duration:2000})
    toast.present();
  }

}
