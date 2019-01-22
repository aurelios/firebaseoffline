import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../../providers/auth/auth-service';
import { Lembrete } from './lembrete.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-lembrete',
  templateUrl: 'lembrete.html',
})
export class LembretePage {
  @ViewChild('form') form: NgForm;

  items: Observable<Lembrete[]>;
  private itemsCollection: AngularFirestoreCollection<Lembrete>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afs: AngularFirestore,
    private authService: AuthService) {

      authService.getUser().subscribe(
        user => {
          this.itemsCollection = this.afs.collection(user.email)
          .doc("entrys").collection<Lembrete>("lembrete", ref => ref.orderBy('nmLembrete', 'desc'));

          this.items = this.itemsCollection.valueChanges();  
      });
  }

  salvar(item: Lembrete) {
    if (this.form.form.valid) {
      //this.itemsRef.push(item);

      
        const id = (item.id == undefined ? this.afs.createId() :  item.id);       
        this.itemsCollection.doc(id).set(item);
      

    }
  }
}
