import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, ToastController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../providers/auth/auth-service';
import { LinhaDePlantio } from '../linhasdeplantio-create/linhadeplantio.model';
import { map } from 'rxjs/operators';
import { LinhasdeplantioCreatePage } from '../linhasdeplantio-create/linhasdeplantio-create';
import { FrutosPorLinhaSelecaoPage } from '../frutosporlinha-selecao/frutosporlinha-selecao';

/**
 * Generated class for the LinhasdeplantioSelecaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-linhasdeplantio-selecao',
  templateUrl: 'linhasdeplantio-selecao.html',
})
export class LinhasdeplantioSelecaoPage {
  items: Observable<LinhaDePlantio[]>;  
  private itemsCollection: AngularFirestoreCollection<LinhaDePlantio>;
  loading: Loading;
  pageId: null;
  
  constructor(public navCtrl: NavController,
    private afs: AngularFirestore, 
    private authService: AuthService,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private navParams: NavParams) { 
      this.pageId = navParams.get('pageId');
  }

  ionViewDidLoad() {
    let loading = this._loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();

    this.authService.getUser().subscribe(
      user => {
        this.itemsCollection = this.afs.collection(user.email)
        .doc("entrys").collection<LinhaDePlantio>("linhadeplantio", ref => ref.orderBy('nroRua', 'asc'));
      
        this.items = this.itemsCollection.snapshotChanges().pipe(
          map(changes => changes.map(a => {
            const data = a.payload.doc.data() as LinhaDePlantio;
            data.id = a.payload.doc.id;            
            return data;
          })
        ));

        loading.dismiss();
         
    });
  }

  removeItem(item: LinhaDePlantio) {
    const alert = this.alertCtrl.create({
      title: 'Exclusão de Registro',
      message: 'Você tem certeza que deseja excluir a Linha de Plantio de Rua '+item.nroRua+' - '+item.variedade+' ?',
      buttons: [
        {
          text: 'Cancelar',         
        },
        {
          text: 'Sim',
          handler: () => {
            this.itemsCollection.doc(item.id).delete();
            this.presentToast('LinhaDePlantio Removida !');
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

  openCreate() {
    this.navCtrl.push(LinhasdeplantioCreatePage);
    //this.modalCtrl.create('AtividadeCreateModalPage', null, { cssClass: 'inset-modal' }).present();
  }

  openEdit(){

  }

  irPara(item: LinhaDePlantio){
    if(this.pageId == "frutosporlinha" || this.pageId == "frutosporposte"){
      this.navCtrl.push(FrutosPorLinhaSelecaoPage, {"linhadeplantio":item, "pageId":this.pageId});
    } else {
      this.navCtrl.push(LinhasdeplantioCreatePage, {"linhadeplantio":item});
    }
  }

}
