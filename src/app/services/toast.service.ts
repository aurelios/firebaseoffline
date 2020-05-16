import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";

@Injectable()
export class ToastService {

    constructor(private toast:ToastController){}

    async showSucess(message:string){
        const toastResult = await this.toast.create({
            message,
            duration: 3000,
            cssClass: 'sucess',
            position: 'bottom'
        });
        toastResult.present();

    }

    async showError(message:string){
        const toastResult = await this.toast.create({
            message,
            duration: 3000,
            cssClass: 'danger',
            position: 'bottom'
        });
        toastResult.present();

    }
}