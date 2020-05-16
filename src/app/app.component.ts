import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController, Loading } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AtividadeSelecaoPage } from '../pages/atividade-selecao/atividade-selecao';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { SigninWithEmailPage } from '../pages/signinwithemail/signinwithemail';
import { AngularFireAuth } from '@angular/fire/auth';
import { LembretePage } from '../pages/lembrete/lembrete';
import { AuthService } from '../providers/auth/auth-service';
import { LinhasdeplantioSelecaoPage } from '../pages/linhasdeplantio-selecao/linhasdeplantio-selecao';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  loading: Loading;
  @ViewChild(Nav) public nav: Nav;
  public paginas = [
    {titulo: 'Atividade', pagina: 'AtividadeSelecaoPage', icone: 'hammer'},
    {titulo: 'Lembrete', pagina: 'LembretePage', icone: 'calendar'},
    {titulo: 'Linhas de Plantio', pagina: 'LinhasdeplantioSelecaoPage', icone: 'git-merge'},
    {titulo: 'Frutos por Linha de Plantio', pagina: 'LinhasdeplantioSelecaoPage', icone: 'logo-apple', params : {pageId:"frutosporlinha"}},
    {titulo: 'Frutos por Poste', pagina: 'LinhasdeplantioSelecaoPage', icone: 'logo-apple', params : {pageId:"frutosporposte"}}
  ];


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private _oneSignal: OneSignal, private localNotifications: LocalNotifications,
    afAuth: AngularFireAuth, private authService: AuthService,
    private _loadingCtrl: LoadingController) {

    afAuth.authState.subscribe(user => {
      if (user && afAuth.auth.currentUser.emailVerified) {
        this.rootPage = 'HomePage';
        this.loading.dismiss();
      } else {
        this.rootPage = SigninWithEmailPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //splashScreen.hide();

      /*
      this._oneSignal.startInit("6dca3a43-0b27-4f2b-a4fc-20678efe4386","720900542322");
      this._oneSignal.inFocusDisplaying(this._oneSignal.OSInFocusDisplayOption.Notification);
      this._oneSignal.handleNotificationReceived().subscribe((notificacao: OSNotification) => {
        console.log("Dados do Push", notificacao);
      });
      this._oneSignal.endInit();
*/

/*
      this.localNotifications.schedule({
        text: 'Teste Delayed 60*1000 ILocalNotification',
        trigger: {at: new Date(new Date().getTime() + 60 * 1000)},
        led: 'FF0000'
     });

*/
    });
  }

  ngOnInit(){
    this.loading = this._loadingCtrl.create({content: 'Por favor, aguarde...'});
    this.loading.present();
  }

  irParaPagina(pagina, params){
    this.nav.push(pagina, params);
  }

  public signOut() {
    this.authService.signOut()
      .then(() => {
        this.rootPage = SigninWithEmailPage;
        //this.navCtrl.parent.parent.setRoot(SigninPage);
      }).catch((error) => {
        console.error(error);
      });
  }

  get usuarioLogado() {
    return this.rootPage != SigninWithEmailPage;
  }
}
