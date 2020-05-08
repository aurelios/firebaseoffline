import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration/';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { MyApp } from './app.component';
import { AtividadePage } from '../pages/atividade/atividade';
import { SigninPage } from '../pages/signin/signin';
import { SigninWithEmailPage } from '../pages/signinwithemail/signinwithemail';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { HomePage } from '../pages/home/home';

import { environment } from '../environments/environment';
import { OneSignal } from '@ionic-native/onesignal';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { AuthService } from '../providers/auth/auth-service';
import { LembretePage } from '../pages/lembrete/lembrete';
import { LembreteCreatePage } from '../pages/lembrete-create/lembrete-create';
import { LinhasdeplantioCreatePage } from '../pages/linhasdeplantio-create/linhasdeplantio-create';
import { LinhasdeplantioSelecaoPage } from '../pages/linhasdeplantio-selecao/linhasdeplantio-selecao';
import { FrutosPorLinhaSelecaoPage } from '../pages/frutosporlinha-selecao/frutosporlinha-selecao';
import { FrutosPorLinhaCreatePage } from '../pages/frutosporlinha-create/frutosporlinha-create';
import { FrutosPorPosteCreatePage } from '../pages/frutosporposte-create/frutosporposte-create';



@NgModule({
  declarations: [
    MyApp,
    AtividadePage,
    SigninPage,
    SigninWithEmailPage,
    SignupPage,
    ResetpasswordPage,
    HomePage,
    LembretePage,
    LembreteCreatePage,
    LinhasdeplantioSelecaoPage,
    LinhasdeplantioCreatePage,    
    FrutosPorLinhaSelecaoPage,
    FrutosPorLinhaCreatePage,
    FrutosPorPosteCreatePage
  ],
  imports: [
    BrowserModule,    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    IonicModule.forRoot(MyApp, {monthShortNames: ['Jan', 'Fev', 'Mar','Mai', 'Abr', 'Jun', 'Jul', 'Ago', 'Set' ,'Out', 'Nov', 'Dez' ]}),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AtividadePage,
    SigninPage,
    SigninWithEmailPage,
    SignupPage,
    ResetpasswordPage,
    HomePage,
    LembretePage,
    LembreteCreatePage,
    LinhasdeplantioSelecaoPage,
    LinhasdeplantioCreatePage,    
    FrutosPorLinhaSelecaoPage,
    FrutosPorLinhaCreatePage,
    FrutosPorPosteCreatePage

  ],
  providers: [
    StatusBar,
    SplashScreen,    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    OneSignal,
    LocalNotifications,
    Vibration
  ]
})
export class AppModule {}
