import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Item } from './../../pages/home/item.model'; 


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private itemsCollection: AngularFireList <Item>;
  items: Observable<any[]>;

  item: Item = {atividade: '', descricao : 'teste', data: undefined};
  constructor(public navCtrl: NavController,private db: AngularFireDatabase) {    
    this.itemsCollection = db.list('entrys');
    this.items = this.itemsCollection.valueChanges();

  }
  addItem(item: Item) {
    this.itemsCollection.push(item);
  }

}
