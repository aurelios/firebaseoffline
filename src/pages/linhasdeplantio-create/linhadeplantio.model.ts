export class LinhaDePlantio { 
    
    id?:string;    
    nroRua: number; 
    variedade : string; 
    qtdPostes: number; 

    constructor(nroRua: number, variedade: string, qtdPostes: number){
        this.nroRua = nroRua;
        this.variedade = variedade;
        this.qtdPostes = qtdPostes;
    }

    parse(): any{
        return {nroRua:parseInt(this.nroRua.toString()), variedade: this.variedade, qtdPostes: parseInt(this.qtdPostes.toString())}
    }
}