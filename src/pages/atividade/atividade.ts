import { Component , ViewChild} from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Atividade } from './atividade.model';
import { map } from 'rxjs/operators';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SigninPage } from '../signin/signin';
import { AuthService } from '../../providers/auth/auth-service';
import { NgForm } from '@angular/forms';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-atividade',
  templateUrl: 'atividade.html'
})
export class AtividadePage {
  @ViewChild('form') form: NgForm;
  items: Observable<Atividade[]>;  
  item: Atividade = {atividade: 'A', descricao : '', data: new Date().toISOString()};
  private itemsCollection: AngularFirestoreCollection<Atividade>;
  loading: Loading;
  
  constructor(public navCtrl: NavController,
    private afs: AngularFirestore, 
    private localNotifications: LocalNotifications, 
    private authService: AuthService,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController) { 
   
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

  async addItem(item: Atividade) {
    await this.presentLoading();
    if (this.form.form.valid) {
      //this.itemsRef.push(item);
      if(item.id){        
        try{
          await this.itemsCollection.doc<Atividade>(item.id).update(item);
        } catch(e){} 
        this.presentToast('Atividade Atualizada com Sucesso !');
      } else {
        try{
          await this.itemsCollection.add(item);
        } catch(e){}
        this.presentToast('Atividade Cadastrada com Sucesso !');

      }      
      await this.loading.dismiss();
      
      this.localNotifications.schedule({
        text: 'Atividade Adicionada: '+item.descricao,
        trigger: {at: new Date(new Date().getTime() + 60 * 1000)},
        led: 'FF0000'
      });
    }
    
  }

  carregaItem(item: Atividade){
    this.item = item;
  }

  removeItem(item: Atividade) {
    this.itemsCollection.doc(item.id).delete();
    this.presentToast('Atividade Removida !');
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
