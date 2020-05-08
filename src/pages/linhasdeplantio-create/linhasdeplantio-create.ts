import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController, ToastController, Loading, NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../../providers/auth/auth-service';
import { NgForm } from '@angular/forms';
import { LinhaDePlantio } from './linhadeplantio.model';
import { map } from 'rxjs/operators';


/**
 * Generated class for the LinhasdeplantioCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-linhasdeplantio-create',
  templateUrl: 'linhasdeplantio-create.html',
})
export class LinhasdeplantioCreatePage {
  @ViewChild('form') form: NgForm;
  loading: Loading;
  private itemsCollection: AngularFirestoreCollection<LinhaDePlantio>;
  item: LinhaDePlantio = new LinhaDePlantio(null, null, null);
  private emailUser: string;

  constructor(public navCtrl: NavController,
    private afs: AngularFirestore,
    private authService: AuthService,
    public viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    params: NavParams
  ) {
    this.authService.getEmail().then( value => {       
      this.emailUser = value
      this.itemsCollection = this.afs.collection(this.emailUser).doc("entrys").collection<LinhaDePlantio>("linhadeplantio", ref => ref.orderBy('nroRua', 'desc'));
      if(params.get("linhadeplantio") != undefined){
        this.item = params.get("linhadeplantio");
      } else {
        this.afs.collection(this.emailUser).doc("entrys").collection<LinhaDePlantio>("linhadeplantio", ref => ref.orderBy('nroRua', 'desc').limit(1))
        .snapshotChanges().pipe(
          map(changes => changes.map(a => {
            const data = a.payload.doc.data() as LinhaDePlantio;
            data.id = a.payload.doc.id;
            return data;
          }))).subscribe(ref => {             
            if(ref[0] != undefined){
              this.item.nroRua = ref[0].nroRua + 1;
            } else {
              this.item.nroRua = 1;
            }
        });
      }
    });
  }
  

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async addItem(item: LinhaDePlantio) {
    if (this.form.form.valid) { 
      const id = (item.id == undefined ? this.afs.createId() :  item.id);
      if(item.id == undefined){
        this.itemsCollection.add(item.parse());
        this.presentToast('Linha de Plantio Cadastrada com Sucesso !');
      } else {
        this.itemsCollection.doc(item.id).update(item);
        this.presentToast('Linha de Plantio Alterada com Sucesso !');
      }
       
      
      this.navCtrl.pop();   
      //await this.loading.dismiss();
      //this.dismiss();  
    }
  }

 /* async addItem(item: LinhaDePlantio) {
    await this.presentLoading();
    if (this.form.form.valid) {
      try{
        await this.itemsCollection.add(item);
        this.presentToast('Linha de Plantio Cadastrada com Sucesso !');
          
        await this.loading.dismiss();
        this.dismiss();
      } catch(e){
        this.loading = await this._loadingCtrl.create({content: e});
        
      }
      
    }
  }*/

  async presentLoading(){
    this.loading = await this._loadingCtrl.create({content: 'Por favor, aguarde...'});
    this.loading.present();
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({message, duration:2000})
    toast.present();
  }  

  ionViewDidEnter(){
    
  }
}
