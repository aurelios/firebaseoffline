export class FrutosLinhadePlantio { 
    
    id?:string;
    qtdFrutos:number;
    data: string;

    constructor(qtdFrutos: number, data: string){
        this.qtdFrutos = qtdFrutos;
        this.data = data;
    }

}