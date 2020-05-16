import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Atividade } from './atividade.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth/auth-service';
import { ToastController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AtividadeCreatePage } from '../index';

@IonicPage()
@Component({
  selector: 'page-atividade',
  templateUrl: 'atividade-selecao.html'
})
export class AtividadeSelecaoPage {
  items: Observable<Atividade[]>;
  private itemsCollection: AngularFirestoreCollection<Atividade>;
  loading: Loading;
  emailUser:string;

  constructor(public navCtrl: NavController,
    private afs: AngularFirestore,
    private authService: AuthService,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {
      this.authService.getEmail().then( value => this.emailUser = value);
  }

  openAtividadeCreateModal() {
    this.navCtrl.push(AtividadeCreatePage);
  }

  ionViewDidLoad() {
    let loading = this._loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();


        this.itemsCollection = this.afs.collection(this.emailUser)
        .doc("entrys").collection<Atividade>("atividades");

        this.items = this.itemsCollection.snapshotChanges().pipe(
          map(changes => changes.map(a => {
            const data = a.payload.doc.data() as Atividade;
            data.id = a.payload.doc.id;
            data.dataAux = data.data.toDate().toISOString();
            return data;
          })
        ));

       loading.dismiss();

  }

  removeItem(item: Atividade) {
    const alert = this.alertCtrl.create({
      title: 'Exclusão de Registro',
      message: 'Você tem certeza que deseja excluir a Atividade '+item.descricao+' ?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sim',
          handler: () => {
            this.itemsCollection.doc(item.id).delete().then(data => this.presentToast('Atividade Removida !'));

          }
        }
      ]
    });

    alert.present();
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({message, duration:2000})
    toast.present();
  }

  irPara(item: Atividade){
    this.navCtrl.push(AtividadeCreatePage, {"atividade":item});
  }

}
