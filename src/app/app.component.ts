import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _oneSignal: OneSignal,
    private localNotifications: LocalNotifications) {

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
}