import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import {  AngularFirestore } from '@angular/fire/firestore';
import { Atividade } from '../atividade-selecao/atividade.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth/auth-service';
import { Lembrete } from '../lembrete/lembrete.model';
import { Home } from './home.model';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  adubacoes: Observable<Atividade[]>;
  pulverizacoes: Observable<Atividade[]>;
  lembreteAdubacao: Lembrete;
  lembretePulverizacao: Lembrete;
  adubacao:  Atividade;
  pulverizacao:  Atividade;
  loading: Loading;

  homeItems: Home[] = [];

  constructor(public navCtrl: NavController,
    private afs: AngularFirestore,
    private authService: AuthService,
    private _loadingCtrl: LoadingController,) {



    
    /*authService.getUser().subscribe(
      user => {

        const item = new Home();
        const item2 = new Home();
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


          afs.collection(user.email)
          .doc("entrys").collection("lembrete", ref => ref.where('atividade', '==', 'P')).snapshotChanges().pipe(
            map(changes => changes.map(a => {
              const data = a.payload.doc.data() as Lembrete;
              data.id = a.payload.doc.id;
              return data;
            }))).subscribe(ref => {this.lembretePulverizacao = ref[0]; item2.atividade = 'P' ; item2.qtdDiasProxAtividade = ref[0].qtdDiasAviso });         


          this.pulverizacoes = this.afs.collection(user.email)
          .doc("entrys").collection<Atividade>("atividades", ref => ref.where('atividade', '==', 'P').
            orderBy('data', 'desc').
            limit(1))
          .snapshotChanges().pipe(
            map(changes => changes.map(a => {
              const data = a.payload.doc.data() as Atividade;
              data.id = a.payload.doc.id;
              return data;
            })));  

          this.pulverizacoes.subscribe(ref => { 
            this.pulverizacao = ref[0]; 
            item2.dtUltAtividade = ref[0].data ; 
            const date = new Date(ref[0].data);
            date.setDate(date.getDate() + parseInt(item2.qtdDiasProxAtividade.toString()));
            item2.dtProxAtividade =  date.toISOString() ;
          });



          

          this.homeItems.push(item);
          this.homeItems.push(item2);
        }
    
      });*/

    


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

  buscaItemHome(dsAtividade: string){
    let item = new Home();
    let lembrete: Lembrete;
    let atividade: Atividade;
    this.authService.getUser().subscribe(
      user => {
        if(user != null) {
          this.afs.collection(user.email)
          .doc("entrys").collection("lembrete", ref => ref.where('atividade', '==', dsAtividade))
          .snapshotChanges().pipe(
            map(changes => changes.map(a => {
              const data = a.payload.doc.data() as Lembrete;
              data.id = a.payload.doc.id;
              return data;
            })))
            .subscribe(ref => {
              lembrete = ref[0]; 
              item.atividade = dsAtividade;
              item.qtdDiasProxAtividade = lembrete.qtdDiasAviso 
            });         
      
      
          this.afs.collection(user.email)
          .doc("entrys").collection<Atividade>("atividades", ref => ref.where('atividade', '==', dsAtividade).
            orderBy('data', 'desc').
            limit(1))
          .snapshotChanges().pipe(
            map(changes => changes.map(a => {
              const data = a.payload.doc.data() as Atividade;
              data.id = a.payload.doc.id;
              return data;
            }))).subscribe(ref => { 
              atividade = ref[0]; 
              if(atividade != undefined){
                item.dtUltAtividade = atividade.data.toDate().toISOString(); 
                const dateProxAtividade = atividade.data.toDate();
                const dataHoje = new Date();
                dataHoje.setHours(0,0,0,0);
                dateProxAtividade.setDate(dateProxAtividade.getDate() + parseInt(item.qtdDiasProxAtividade.toString()));
                dateProxAtividade.setHours(0,0,0,0);
                item.dtProxAtividade =  dateProxAtividade.toISOString() ;

                var diffc = dateProxAtividade.getTime() - dataHoje.getTime();
                item.qtdDiasFaltamAtividade = Math.round(Math.abs(diffc/(1000*60*60*24)));
                if(dateProxAtividade.getTime() < dataHoje.getTime()){
                item.isToday = -1; 
                } else if(dateProxAtividade.getTime() > dataHoje.getTime()){
                  item.isToday = 1;
                } else {
                  item.isToday = 0;
                }
              }
          });
        }
    });
    return item;
  }
  
  ionViewDidLoad() {
    //this.homeItems.push(this.buscaItemHome('A'));
    //this.homeItems.push(this.buscaItemHome('P'));
  }



  ionViewWillEnter(){   

    this.homeItems = [];
    this.homeItems.push(this.buscaItemHome('A'));
    this.homeItems.push(this.buscaItemHome('P'));
  }

}
