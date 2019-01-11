import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Atividade } from './atividade.model';
import { map } from 'rxjs/operators';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SigninPage } from '../signin/signin';
import { AuthService } from '../../providers/auth/auth-service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //itemsRef: AngularFireList<Atividade>;

  items: Observable<Atividade[]>;
  private itemsCollection: AngularFirestoreCollection<Atividade>;

  item: Atividade = {atividade: 'A', descricao : '', data: new Date().toISOString()};
  constructor(public navCtrl: NavController,private db: AngularFireDatabase,
    private afs: AngularFirestore, private localNotifications: LocalNotifications, private authService: AuthService) {
    //this.itemsRef =  db.list('entrys');
    //this.items = this.itemsRef.valueChanges();


    this.itemsCollection = afs.collection<Atividade>('entrys', ref => ref.orderBy('createdAt', 'desc'));
    this.items = afs.collection('entrys').snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as Atividade;
        data.id = a.payload.doc.id;
        return data;
      })));

    
  
  }
  addItem(item: Atividade) {
    //this.itemsRef.push(item);
    this.itemsCollection.add(item);
    this.localNotifications.schedule({
      text: 'Atividade Adicionada: '+item.descricao,
      trigger: {at: new Date(new Date().getTime() + 60 * 1000)},
      led: 'FF0000'
   });
  }

  removeItem(item: Atividade) {
    this.afs.doc('entrys/'+item.id).delete();
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
