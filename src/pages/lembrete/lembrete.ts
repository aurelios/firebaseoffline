import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../../providers/auth/auth-service';
import { Lembrete } from './lembrete.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LembreteCreatePage } from '../lembrete-create/lembrete-create';

@IonicPage()
@Component({
  selector: 'page-lembrete',
  templateUrl: 'lembrete.html',
})
export class LembretePage {
  @ViewChild('form') form: NgForm;

  items: Observable<Lembrete[]>;
  private itemsCollection: AngularFirestoreCollection<Lembrete>;

  adubacao: Observable<Lembrete>;// = {atividade:'A', qtdDiasAviso:null};
  pulverizacao: Observable<Lembrete>; //= {atividade:'P', qtdDiasAviso:null}

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afs: AngularFirestore,
    private authService: AuthService) {




      authService.getUser().subscribe(
        user => {
          this.adubacao = this.afs.collection(user.email).doc("entrys").collection("lembrete").doc<Lembrete>("adubacao").valueChanges();

          this.pulverizacao = this.afs.collection(user.email).doc("entrys").collection("lembrete").doc<Lembrete>("pulverizacao").valueChanges();
         

          this.itemsCollection = this.afs.collection(user.email)
          .doc("entrys").collection<Lembrete>("lembrete", ref => ref.orderBy('atividade', 'desc'));

          this.items = this.itemsCollection.snapshotChanges().pipe(
            map(changes => changes.map(a => {
              const data = a.payload.doc.data() as Lembrete;
              data.id = a.payload.doc.id;              
              return data;
            })
          )); 
      });
  }

  removeItem(item: Lembrete) {
    this.itemsCollection.doc(item.id).delete();
  }

  openEditItem(item: Lembrete) {
    this.navCtrl.push(LembreteCreatePage, {lembrete: item, tittle:'Alterar Lembrete'});
  }

  openNewItem() {
    this.navCtrl.push(LembreteCreatePage,{tittle:'Novo Lembrete'});
  }

  /*salvar(item: Lembrete) {
    if (this.form.form.valid) {
      //this.itemsRef.push(item);      
        const id = (item.id == undefined ? this.afs.createId() :  item.id);       
        this.itemsCollection.doc(id).set(item);      

    }
  }*/

  salvar() {
    if (this.form.form.valid) {


      this.authService.getUser().subscribe(
        user => {

          this.adubacao.subscribe(value => {            
            this.afs.collection(user.email).doc("entrys").collection<Lembrete>("lembrete").doc("adubacao").set(value);
          })

          this.pulverizacao.subscribe(value => {            
            this.afs.collection(user.email).doc("entrys").collection<Lembrete>("lembrete").doc("pulverizacao").set(value);
          })

      });



    }
  }
}
