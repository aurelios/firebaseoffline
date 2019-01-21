import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../../providers/auth/auth-service';
import { Lembrete } from './lembrete.model';
import { map } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-lembrete',
  templateUrl: 'lembrete.html',
})
export class LembretePage {
  adubacao: Lembrete;
  pulverizacao: Lembrete;
  private adubacaoDocument: AngularFirestoreDocument<Lembrete>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afs: AngularFirestore,
    private authService: AuthService) {

     /* authService.getUser().subscribe(
        user => {
          
          this.adubacaoDocument = this.afs.collection(user.email)
          .doc("entrys").collection("pulverizacao").doc("adubacao");
          
         // this.adubacaoDocument.snapshotChanges().pipe(t => t.m);

          this.adubacaoDocument.snapshotChanges().pipe(
            map(changes => 
                         
              
              map(a => {
              const data = a.payload.doc.data() as Atividade;
              data.id = a.payload.doc.id;
              return data;
            }))); 
          
          
         
      });*/


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LembretePage');
  }

}
