export class Atividade { 
    
    id?:string;
    atividade: string; 
    descricao : string; 
    data: string;

    constructor(atividade: string, descricao: string, data: string){
        this.atividade = atividade;
        this.descricao = descricao;
        this.data = data;
    }

}