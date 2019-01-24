import { Timestamp } from "rxjs";

export class Atividade { 
    
    id?:string;
    atividade: string; 
    descricao : string; 
    data: Timestamp<Date>;

}