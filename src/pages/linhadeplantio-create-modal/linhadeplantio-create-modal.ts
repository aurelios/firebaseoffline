import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, IonicPage, Loading, ToastController, LoadingController} from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth-service';
import { FrutosLinhadePlantio } from '../frutosporlinha-create/frutoslinhadeplantio.model';
import { LinhaDePlantio } from '../linhasdeplantio-create/linhadeplantio.model';

@IonicPage()
@Component({
  selector: 'linhadeplantio-create-modal',
  templateUrl: 'linhadeplantio-create-modal.html'
})
export class LinhadePlantioCreateModalPage {
  @ViewChild('form') form: NgForm;  
  loading: Loading;
  private itemsCollection: AngularFirestoreCollection<FrutosLinhadePlantio>;
  linhadeplantio: LinhaDePlantio;
  item: FrutosLinhadePlantio;
  private emailUser: string;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    public viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    params: NavParams
  ) {
    this.linhadeplantio = params.get("linhadeplantio");
    this.item = params.get('frutosporlinha') ? params.get('frutosporlinha') : {qtdFrutos:0 ,data: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()).toISOString()};


    this.authService.getEmail().then( value => {
      this.emailUser = value;
      this.itemsCollection = this.afs.collection<FrutosLinhadePlantio>(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha',  ref => ref.where('data', '==', this.item.data).limit(1));
      this.itemsCollection.valueChanges().subscribe(value => {
        if(value.length > 0) this.item = value[0];
      });
    });
    
  }

  async addItem(item: FrutosLinhadePlantio) {    
    if (this.form.form.valid) {
      await this.presentLoading();
      try{        
        if(item.id == undefined){
          this.item.id = this.afs.createId();
          this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha').doc(item.id).set(item);
        } /*else {
          this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha').doc(item.id).update(item);
        }*/
      } catch(e){}
          
      await this.loading.dismiss();
      this.dismiss();
    }    
  }

  dismiss() {
    this.viewCtrl.dismiss({"frutosporlinha":this.item});
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
