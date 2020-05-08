export class FrutosPoste { 
    
    id?:string;
    nrPoste:number;
    qtdFrutos:number;

    constructor(nrPoste:number, qtdFrutos: number){
        this.nrPoste = nrPoste;
        this.qtdFrutos = qtdFrutos;
    }

}