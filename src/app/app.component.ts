import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AtividadePage } from '../pages/atividade/atividade';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HomePage } from '../pages/home/home';

import { SigninWithEmailPage } from '../pages/signinwithemail/signinwithemail';
import { AngularFireAuth } from '@angular/fire/auth';
import { LembretePage } from '../pages/lembrete/lembrete';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  @ViewChild(Nav) public nav: Nav;
  public paginas = [    
    {titulo: 'Atividade', pagina: AtividadePage, icone: 'hammer'},
    {titulo: 'Lembrete', pagina: LembretePage, icone: 'calendar'}
  ];


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private _oneSignal: OneSignal, private localNotifications: LocalNotifications,
    afAuth: AngularFireAuth) {

    afAuth.authState.subscribe(user => {
      if (user && afAuth.auth.currentUser.emailVerified) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = SigninWithEmailPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this._oneSignal.startInit("6dca3a43-0b27-4f2b-a4fc-20678efe4386","720900542322");
      this._oneSignal.inFocusDisplaying(this._oneSignal.OSInFocusDisplayOption.Notification);
      this._oneSignal.handleNotificationReceived().subscribe((notificacao: OSNotification) => {
        console.log("Dados do Push", notificacao);
      });
      this._oneSignal.endInit();



      this.localNotifications.schedule({
        text: 'Teste Delayed 60*1000 ILocalNotification',
        trigger: {at: new Date(new Date().getTime() + 60 * 1000)},
        led: 'FF0000'
     });


    });
  }

  irParaPagina(pagina){
    this.nav.push(pagina);
  }
}