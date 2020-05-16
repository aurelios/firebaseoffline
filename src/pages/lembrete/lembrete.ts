import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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
  emailUser:string;
  items: Observable<Lembrete[]>;
  private itemsCollection: AngularFirestoreCollection<Lembrete>;

  adubacao: Lembrete = {atividade:'A', qtdDiasAviso:null};
  pulverizacao: Lembrete= {atividade:'P', qtdDiasAviso:null};

  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private authService: AuthService) {

      this.authService.getEmail().then( value => {
        this.emailUser = value;
        
        this.afs.collection(this.emailUser).doc("entrys")
        .collection("lembrete").doc<Lembrete>("adubacao").valueChanges().subscribe(value => this.adubacao = value);

        this.afs.collection(this.emailUser).doc("entrys")
        .collection("lembrete").doc<Lembrete>("pulverizacao").valueChanges().subscribe(value => this.pulverizacao = value);
      

        this.itemsCollection = this.afs.collection(this.emailUser)
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
    this.navCtrl.push('LembreteCreatePage', {lembrete: item, tittle:'Alterar Lembrete'});
  }

  openNewItem() {
    this.navCtrl.push('LembreteCreatePage',{tittle:'Novo Lembrete'});
  }

  salvar() {
    if (this.form.form.valid) {
        this.afs.collection(this.emailUser).doc("entrys").collection<Lembrete>("lembrete").doc("adubacao").set(this.adubacao);
        this.afs.collection(this.emailUser).doc("entrys").collection<Lembrete>("lembrete").doc("pulverizacao").set(this.pulverizacao);
        this.presentToast('Lembrete Salvo com Sucesso !');
        this.navCtrl.pop();
    }
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({message, duration:2000})
    toast.present();
  }
}
