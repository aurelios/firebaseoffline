import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Atividade } from '../atividade/atividade.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth/auth-service';
import { Lembrete } from '../lembrete/lembrete.model';
import { Home } from './home.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  adubacoes: Observable<Atividade[]>;
  lembreteAdubacao:  Lembrete;
  adubacao:  Atividade;
  pulverizacao: Observable<Atividade[]>;

  homeItems: Home[] = [];

  constructor(public navCtrl: NavController,
    private afs: AngularFirestore,
    private authService: AuthService) {
    
    authService.getUser().subscribe(
      user => {

          const item = new Home();
        if(user != null){
          afs.collection(user.email)
          .doc("entrys").collection("lembrete", ref => ref.where('atividade', '==', 'A')).snapshotChanges().pipe(
            map(changes => changes.map(a => {
              const data = a.payload.doc.data() as Lembrete;
              data.id = a.payload.doc.id;
              return data;
            }))).subscribe(ref => {this.lembreteAdubacao = ref[0]; item.atividade = 'A' ; item.qtdDiasProxAtividade = ref[0].qtdDiasAviso });         


          this.adubacoes = this.afs.collection(user.email)
          .doc("entrys").collection<Atividade>("atividades", ref => ref.where('atividade', '==', 'A').
            orderBy('data', 'desc').
            limit(1))
          .snapshotChanges().pipe(
            map(changes => changes.map(a => {
              const data = a.payload.doc.data() as Atividade;
              data.id = a.payload.doc.id;
              return data;
            })));  

          this.adubacoes.subscribe(ref => { 
            this.adubacao = ref[0]; 
            item.dtUltAtividade = ref[0].data ; 
            const date = new Date(ref[0].data);
            date.setDate(date.getDate() + parseInt(item.qtdDiasProxAtividade.toString()));
            item.dtProxAtividade =  date.toISOString() ;
          });

          this.homeItems.push(item);
        }
    
      });

    


    /*this.pulverizacao = afs.collection('entrys', ref => ref.where('atividade', '==', 'P').
      orderBy('data', 'desc').
      limit(1))
    .snapshotChanges().pipe(      
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as Atividade;
        data.id = a.payload.doc.id;
        return data;
      })));*/
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
