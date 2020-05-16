import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController, ViewController, ModalController, Modal, AlertController } from 'ionic-angular';
import { FrutosPoste } from './frutosposte.model';
import { Observable, observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth/auth-service';
import { LinhaDePlantio } from '../linhasdeplantio-create/linhadeplantio.model';
import { Vibration } from '@ionic-native/vibration';
import { FrutosLinhadePlantio } from '../frutosporlinha-create/frutoslinhadeplantio.model';


/**
 * Generated class for the FrutosPorPosteCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-frutosporposte-create',
  templateUrl: 'frutosporposte-create.html',
})
export class FrutosPorPosteCreatePage {
  @ViewChild('form') form: NgForm;
  loading: Loading;
  items$: Observable<FrutosPoste[]>;  
  frutosPoste: FrutosPoste[];  
  private itemsCollection: AngularFirestoreCollection<FrutosPoste>;
  private frutoslinha: FrutosLinhadePlantio;
  item: FrutosPoste = {nrPoste:1, qtdFrutos: 0};
  linhadeplantio: LinhaDePlantio;
  private emailUser: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private authService: AuthService,
    private afs: AngularFirestore,
    private vibration: Vibration,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
    ) {
      this.linhadeplantio = navParams.get("linhadeplantio");
      this.frutoslinha = navParams.get("frutoslinhadeplantio");
      this.authService.getEmail().then( value => this.emailUser = value);
  }

  ionViewDidLoad() {
    
    if(!this.frutoslinha) {
      let modal: Modal  = this.modalCtrl.create('LinhadePlantioCreateModalPage', 
      {"linhadeplantio":this.linhadeplantio,"frutoslinhadeplantio": this.frutoslinha }, 
      { cssClass: 'inset-modal-linhadeplantio' });
      modal.onWillDismiss(data => {
       
        this.frutoslinha = data.frutosporlinha;
        this.geradorFrutosPorPoste();
        this.carregaFrutosPorPoste();
        
      });
      modal.present();
    } else { 
      this.presentLoading();
      this.carregaFrutosPorPoste().then(sucess => this.loading.dismiss());
    }    
    
  }

  async carregaFrutosPorPoste():Promise<boolean>{
    this.itemsCollection = this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha/'+this.frutoslinha.id+'/frutosporposte');
    this.items$ = await this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FrutosPoste;
        const id = a.payload.doc.id;          
        return { id, ...data };
      }))
    );    

    await this.items$.subscribe(array => {
      this.frutosPoste = array;
      if(this.item.nrPoste == 1)
        this.item = this.buscaFrutosPorPoste(1);            
    });   
    
    return true;
    
  }

  async geradorFrutosPorPoste(){
    for(let i = 1; i <= this.linhadeplantio.qtdPostes; i++){
      let frutosPoste:FrutosPoste  ={nrPoste: i,qtdFrutos: 0};
      this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha/'+this.frutoslinha.id+'/frutosporposte').add(frutosPoste);
    }
  }

  ionViewWillLeave(){    
    this.navCtrl.getPrevious().data.linhadeplantio = this.linhadeplantio;
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

  async salvar(frutoposte:FrutosPoste) : Promise<boolean>{
      let hasSaved:boolean = false;
      let qtdFrutosTotal:number = 0;   
      await this.frutosPoste.forEach(itemFrutosPoste => {
        qtdFrutosTotal += itemFrutosPoste.qtdFrutos;
        if(frutoposte.nrPoste == itemFrutosPoste.nrPoste && frutoposte.qtdFrutos != itemFrutosPoste.qtdFrutos)
          hasSaved = true;
          this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha/'+this.frutoslinha.id+'/frutosporposte/').doc(itemFrutosPoste.id).update(itemFrutosPoste);
      });
      if(qtdFrutosTotal != this.frutoslinha.qtdFrutos) {
        this.frutoslinha.qtdFrutos = qtdFrutosTotal;
        hasSaved = true;
        await this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha/').doc(this.frutoslinha.id).update(this.frutoslinha);
      }
      if(hasSaved)
        this.presentToast("Lançamento de Frutos Salvo com Sucesso.");
      return hasSaved;      
      //this.navCtrl.pop();
  }

 async processaTrocaDeRua(linha:LinhaDePlantio){
  this.linhadeplantio = linha;
  await this.afs.collection(this.emailUser).doc('entrys/linhadeplantio/'+this.linhadeplantio.id)
  .collection<FrutosLinhadePlantio>('linhadeplantio', ref => ref.where('data', '==', new Date().toISOString()).limit(1))
  .valueChanges().subscribe(value => {
    value.length > 0 ? this.frutoslinha = value[0] : this.frutoslinha = undefined;
    this.item = {nrPoste:1, qtdFrutos: 0};

    //Cria Frutos por Linha
    let frutosPorLinha:FrutosLinhadePlantio = {qtdFrutos:0 ,data: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()).toISOString()}
    frutosPorLinha.id = this.afs.createId();
    this.frutoslinha = frutosPorLinha;

    let frutosLinhaCollection = this.afs.collection<FrutosLinhadePlantio>(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha',  ref => ref.where('data', '==', frutosPorLinha.data).limit(1));
    frutosLinhaCollection.valueChanges().subscribe(value => {
      if(value.length > 0) {
        frutosPorLinha = value[0];
        this.frutoslinha = frutosPorLinha;
        this.carregaFrutosPorPoste();
      } else {
        this.afs.collection(this.emailUser+'/entrys/linhadeplantio/'+this.linhadeplantio.id+'/frutosporlinha/').doc(frutosPorLinha.id).set(frutosPorLinha);
        this.geradorFrutosPorPoste();
        this.carregaFrutosPorPoste();
      }
    });
  });
 }

  ruaAnterior(){    
    this.presentLoading();
    this.salvar(this.item);
    this.vibration.vibrate(400);

    if(this.linhadeplantio.nroRua > 1){
      this.afs.collection(this.emailUser).doc('entrys')
      .collection<LinhaDePlantio>('linhadeplantio', ref => ref.where('nroRua', '==', this.linhadeplantio.nroRua - 1).limit(1))
      .valueChanges()
      .subscribe(value => {          
        if(value.length > 0) {
          this.processaTrocaDeRua(value[0]);
        }
        this.loading.dismiss();
      });
    } else {
      this.afs.collection(this.emailUser).doc('entrys')
      .collection<LinhaDePlantio>('linhadeplantio', ref => ref.orderBy('nroRua', 'desc').limit(1))
      .valueChanges()
      .subscribe(value => {           
        if(value.length > 0) {
          this.processaTrocaDeRua(value[0]);
        } 
        this.loading.dismiss();
      });
    }
  }

  proximaRua() {    
    this.presentLoading();
    this.salvar(this.item);
    this.vibration.vibrate(400);

    this.afs.collection(this.emailUser).doc('entrys')
    .collection<LinhaDePlantio>('linhadeplantio', ref => ref.where('nroRua', '==', this.linhadeplantio.nroRua + 1).limit(1))
    .valueChanges()
    .subscribe(value => {    
      
      if(value.length > 0) {
        this.processaTrocaDeRua(value[0]);        
      } else {          
        this.afs.collection(this.emailUser).doc('entrys')
        .collection<LinhaDePlantio>('linhadeplantio', ref => ref.where('nroRua', '==',  1).limit(1))
        .valueChanges().subscribe(value => this.processaTrocaDeRua(value[0]));  
      }

      this.loading.dismiss();

    });
  }

  buscaFrutosPorPoste(nroPoste:number) : FrutosPoste {
   let frutosPoste:FrutosPoste;
    this.frutosPoste.forEach(itemFrutosPoste => {
     if(itemFrutosPoste.nrPoste == nroPoste)
      frutosPoste =  itemFrutosPoste;
    });
    return frutosPoste;    
  }
  
  async swipeEvent(e) {
    this.presentLoading();
    await this.salvar(this.item).then(sucess => {
      if(e.offsetDirection == 2){//right to left
        if(this.item.nrPoste +1 > this.linhadeplantio.qtdPostes){
         this.item = this.buscaFrutosPorPoste(1);
        } else {
          this.item = this.buscaFrutosPorPoste(this.item.nrPoste + 1);
        }
      } else if(e.offsetDirection == 4){//left to right
        if(this.item.nrPoste -1 == 0){
          this.item = this.buscaFrutosPorPoste(this.linhadeplantio.qtdPostes);
        } else {
          this.item = this.buscaFrutosPorPoste(this.item.nrPoste + -1);
        }
      }
      this.loading.dismiss();
    });

    this.vibration.vibrate(200);
  }

  tap(e){
    this.item.qtdFrutos++;
    this.vibration.vibrate(50);
  }
  /*
  doPrompt() {
    const alert = this.alertCtrl.create({
      title: 'Informe a data',
      message: 'Enter a name for this new album you\'re so keen on adding',
      inputs: [
        { type: 'ion-datetime',
          name: 'data',
          placeholder: 'Data'
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: (data: any) => {
            console.log('Saved clicked', data);
          }
        }
      ]
    });

    alert.present();
  }

  doConfirm() {
    const alert = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });

    alert.present();
  }*/

}
