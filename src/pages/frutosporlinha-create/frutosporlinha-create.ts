import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController, ViewController } from 'ionic-angular';
import { FrutosLinhadePlantio } from './frutoslinhadeplantio.model';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth/auth-service';
import { LinhaDePlantio } from '../linhasdeplantio-create/linhadeplantio.model';
import { Vibration } from '@ionic-native/vibration';


/**
 * Generated class for the FrutosporlinhaCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-frutosporlinha-create',
  templateUrl: 'frutosporlinha-create.html',
})
export class FrutosPorLinhaCreatePage {
  @ViewChild('form') form: NgForm;
  loading: Loading;
  items: Observable<FrutosLinhadePlantio[]>;  
  private itemsCollection: AngularFirestoreCollection<FrutosLinhadePlantio>;
  item: FrutosLinhadePlantio = {data: new Date().toISOString(), qtdFrutos: 0};
  linhadeplantio: LinhaDePlantio;
  private emailUser: string;
  private callback;

  public press: number = 0;
  public pan: number = 0;
  public swipe: number = 0;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private authService: AuthService,
    private afs: AngularFirestore,
    private vibration: Vibration) {
      this.linhadeplantio = navParams.get("linhadeplantio");
      let frutoslinha = navParams.get("frutoslinhadeplantio");
      if (frutoslinha)
        this.item = frutoslinha;
      this.authService.getEmail().then( value => this.emailUser = value);

      this.callback = this.navParams.get("callback")
      
  }

  ionViewDidLoad() {        
    this.itemsCollection = this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha');

    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FrutosLinhadePlantio;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  ionViewDidLeave(){
    this.callback(this.linhadeplantio).then(()=>{
         
    });
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({message, duration:2000})
    toast.present();
  }

  async presentLoading(){
    this.loading = await this._loadingCtrl.create({content: 'Por favor, aguarde...'});
    this.loading.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async salvar(item: FrutosLinhadePlantio) {
    if (this.form.form.valid) { 
      const id = (item.id == undefined ? this.afs.createId() :  item.id);
      if(item.id == undefined){
        this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha').add(item);
      } else {
        this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha').doc(item.id).update(item);
      }
      
      this.navCtrl.pop();      
    }
  }

  pressEvent(e) {
    this.press++
  }
  panEvent(e) {
    this.pan++
  }

  swipeEvent(e) {
    if(e.offsetDirection == 2){//right to left 
      this.afs.collection(this.emailUser).doc('entrys')
      .collection<LinhaDePlantio>('linhadeplantio', ref => ref.where('nroRua', '==', this.linhadeplantio.nroRua + 1).limit(1))
      .valueChanges()
      .subscribe(value => {    
        if(value.length > 0) {
          this.linhadeplantio = value[0];        
        } else {          
          this.afs.collection(this.emailUser).doc('entrys')
          .collection<LinhaDePlantio>('linhadeplantio', ref => ref.where('nroRua', '==',  1).limit(1))
          .valueChanges()
          .subscribe(value => { 
            this.linhadeplantio = value[0]; 
          });         
          //TODO find by data or new
        }
        this.item = {data: new Date().toISOString(), qtdFrutos: 0};
        this.ionViewDidLoad();
      });
    } else if(e.offsetDirection == 4){//left to right      
      if(this.linhadeplantio.nroRua > 1){
        this.afs.collection(this.emailUser).doc('entrys')
        .collection<LinhaDePlantio>('linhadeplantio', ref => ref.where('nroRua', '==', this.linhadeplantio.nroRua - 1).limit(1))
        .valueChanges()
        .subscribe(value => {              
          this.linhadeplantio = value[0];
          //TODO find by data or new
          this.item = {data: new Date().toISOString(), qtdFrutos: 0};
          this.ionViewDidLoad();            
        });
      } else {
        this.afs.collection(this.emailUser).doc('entrys')
        .collection<LinhaDePlantio>('linhadeplantio', ref => ref.orderBy('nroRua', 'desc').limit(1))
        .valueChanges()
        .subscribe(value => {           
          this.linhadeplantio = value[0];
          //TODO find by data or new
          this.item = {data: new Date().toISOString(), qtdFrutos: 0};
          this.ionViewDidLoad();            
        });
      }
    }
    this.vibration.vibrate(400);
  }

  tap(e){
    this.item.qtdFrutos++;
    this.vibration.vibrate(50);
  }

}
