import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { FrutosLinhadePlantio } from '../frutosporlinha-create/frutoslinhadeplantio.model';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../providers/auth/auth-service';
import { map } from 'rxjs/operators';
import { FrutosPorLinhaCreatePage } from '../frutosporlinha-create/frutosporlinha-create';
import { LinhaDePlantio } from '../linhasdeplantio-create/linhadeplantio.model';
import { FrutosPorPosteCreatePage } from '../frutosporposte-create/frutosporposte-create';

/**
 * Generated class for the FrutosporlinhaSelecaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-frutosporlinha-selecao',
  templateUrl: 'frutosporlinha-selecao.html',
})
export class FrutosPorLinhaSelecaoPage {
  linhadeplantio: LinhaDePlantio;
  items: Observable<FrutosLinhadePlantio[]>;  
  private itemsCollection: AngularFirestoreCollection<FrutosLinhadePlantio>;
  loading: Loading;
  private pageId;
  emailUser:string;

  constructor(public navCtrl: NavController, 
    private navParams: NavParams,    
    private authService: AuthService,
    private afs: AngularFirestore,
    private _loadingCtrl: LoadingController) {
      this.linhadeplantio = navParams.get("linhadeplantio");
      this.pageId = navParams.get("pageId");
      this.authService.getEmail().then( value => this.emailUser = value);
  }

  deleteItem(list, index) {
    list.splice(index,1);
  }

  openCreate() {
    if(this.pageId == "frutosporposte"){
      this.navCtrl.push(FrutosPorPosteCreatePage,{"linhadeplantio":this.linhadeplantio, "callback":this.myCallbackFunction});
    } else {
      this.navCtrl.push(FrutosPorLinhaCreatePage,{"linhadeplantio":this.linhadeplantio, "callback":this.myCallbackFunction});
    }
  }

  
  ionViewWillEnter(){
    this.linhadeplantio = this.navParams.get('linhadeplantio')|| null;
    let loading = this._loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();

    this.itemsCollection = this.afs.collection<FrutosLinhadePlantio>(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha');
  
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as FrutosLinhadePlantio;
        data.id = a.payload.doc.id;            
        return data;
      })
    ));
    loading.dismiss(); 
  }

  myCallbackFunction = function(_params) {
    return new Promise((resolve, reject) => {
            this.linhadeplantio = _params;  
            this.a = _params; 
            resolve();    
     });
  }

  irPara(item: FrutosLinhadePlantio){    
    if(this.pageId == "frutosporposte"){
      this.navCtrl.push(FrutosPorPosteCreatePage,{"linhadeplantio":this.linhadeplantio,"frutoslinhadeplantio":item, "callback":this.myCallbackFunction});
    } else {
      this.navCtrl.push(FrutosPorLinhaCreatePage, {"linhadeplantio":this.linhadeplantio,"frutoslinhadeplantio":item, "callback":this.myCallbackFunction}); 
    }       
  }

  removeItem(item: FrutosLinhadePlantio) {
    this.itemsCollection.doc(item.id).delete();
  }
}
