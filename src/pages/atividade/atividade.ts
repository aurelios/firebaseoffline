import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Atividade } from './atividade.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth/auth-service';
import { ToastController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-atividade',
  templateUrl: 'atividade.html'
})
export class AtividadePage {
  items: Observable<Atividade[]>;  
  private itemsCollection: AngularFirestoreCollection<Atividade>;
  loading: Loading;
  
  constructor(public navCtrl: NavController,
    private afs: AngularFirestore, 
    private authService: AuthService,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) { 
   
  }

  openAtividadeCreateModal() {
    this.modalCtrl.create('AtividadeCreateModalPage', null, { cssClass: 'inset-modal' }).present();
  }

  ionViewDidLoad() {
    let loading = this._loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();

    this.authService.getUser().subscribe(
      user => {
        this.itemsCollection = this.afs.collection(user.email)
        .doc("entrys").collection<Atividade>("atividades", ref => ref.orderBy('data', 'desc'));
      
        this.items = this.itemsCollection.snapshotChanges().pipe(
          map(changes => changes.map(a => {
            const data = a.payload.doc.data() as Atividade;
            data.id = a.payload.doc.id;
            
            return data;
          })
        ));

        loading.dismiss();
         
    });
  }

  removeItem(item: Atividade) {
    this.itemsCollection.doc(item.id).delete();
    this.presentToast('Atividade Removida !');
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({message, duration:2000})
    toast.present();
  }

}
