import { firestore } from "firebase";



export class Atividade { 
    
    id?:string;
    atividade: string; 
    descricao : string; 
    data: firestore.Timestamp;
    dataAux: string;

    constructor(atividade: string, descricao: string, dataAux: string){
        this.atividade = atividade;
        this.descricao = descricao;
        this.dataAux = dataAux;
    }

    static parse(obj:Atividade):any{
        let data = new Date(obj.dataAux);
        return {atividade:obj.atividade, descricao:obj.descricao, data: new Date(data.getFullYear(),data.getMonth(),data.getDay())};
    }

}