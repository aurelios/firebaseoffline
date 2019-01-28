export class Lembrete { 
    
    id?:string;
    atividade: string;
    qtdDiasAviso: Number;

    constructor(atividade: string, qtdDiasAviso: Number){
        this.atividade = atividade;
        this.qtdDiasAviso = qtdDiasAviso;
    }

}