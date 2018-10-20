import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Item } from './../../pages/home/item.model'; 
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  itemsRef: AngularFireList<Item>;
  items: Observable<Item[]>;

  private itemsCollection: AngularFirestoreCollection<Item>;
  item: Item = {atividade: '', descricao : 'teste', data: undefined};
  constructor(public navCtrl: NavController,private db: AngularFireDatabase,private afs: AngularFirestore) { 
    //this.itemsRef =  db.list('entrys');
    //this.items = this.itemsRef.valueChanges();


    this.itemsCollection = afs.collection<Item>('entrys');
    this.items = this.itemsCollection.valueChanges();
  }
  addItem(item: Item) {
    //this.itemsRef.push(item);
    this.itemsCollection.add(item);
  }

}
