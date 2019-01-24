import { Component , ViewChild} from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Atividade } from './atividade.model';
import { map } from 'rxjs/operators';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SigninPage } from '../signin/signin';
import { AuthService } from '../../providers/auth/auth-service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'page-atividade',
  templateUrl: 'atividade.html'
})
export class AtividadePage {
  @ViewChild('form') form: NgForm;
  items: Observable<Atividade[]>;  
  item: Atividade = {atividade: 'A', descricao : '', data: null};  
  private itemsCollection: AngularFirestoreCollection<Atividade>;
  
  constructor(public navCtrl: NavController,
    private afs: AngularFirestore, 
    private localNotifications: LocalNotifications, 
    private authService: AuthService,
    private _loadingCtrl: LoadingController) { 
   
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

  addItem(item: Atividade) {
    if (this.form.form.valid) {
      //this.itemsRef.push(item);
      this.itemsCollection.add(item);

      this.localNotifications.schedule({
        text: 'Atividade Adicionada: '+item.descricao,
        trigger: {at: new Date(new Date().getTime() + 60 * 1000)},
        led: 'FF0000'
      });
    }
  }

  removeItem(item: Atividade) {
    this.itemsCollection.doc(item.id).delete();
  }

  public signOut() {
    this.authService.signOut()
      .then(() => {
        this.navCtrl.parent.parent.setRoot(SigninPage);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
