import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, IonicPage, Loading, ToastController, LoadingController, NavController} from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Atividade } from '../atividade-selecao/atividade.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth-service';
import { ToastService } from '../../app/services/toast.service';

@IonicPage()
@Component({
  selector: 'atividade-create',
  templateUrl: 'atividade-create.html'
})
export class AtividadeCreatePage {
  @ViewChild('form') form: NgForm;
  loading: Loading;
  private itemsCollection: AngularFirestoreCollection<Atividade>;
  item: Atividade = new Atividade('A', null, new Date().toISOString());
  emailUser:string;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    public viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    params: NavParams,
    public navCtrl: NavController,
    public toastService: ToastService
  ) {
    this.authService.getEmail().then( value => {
      this.emailUser = value;
      this.itemsCollection = this.afs.collection(this.emailUser).doc("entrys").collection<Atividade>("atividades", ref => ref.orderBy('data', 'desc'));
    });
    if(params.get("atividade"))
      this.item = params.get("atividade");  
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async addItem(item: Atividade) {
    if (this.form.form.valid) { 
      const id = (item.id == undefined ? this.afs.createId() :  item.id);
      if(item.id == undefined){
        this.itemsCollection.add(Atividade.parse(item)).then(data => {
          this.toastService.showSucess('Atividade Cadastrada com Sucesso !');
           this.navCtrl.pop();
        });
      } else {
        this.itemsCollection.doc(item.id).update(Atividade.parse(item)).then(data => {
          this.presentToast('Atividade Alterada com Sucesso !')
          this.navCtrl.pop();
        });        
      }
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
