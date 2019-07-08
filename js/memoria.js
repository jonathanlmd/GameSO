var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};
var game = new Phaser.Game(config);

function preload ()
{	
	this.load.image('sky','img/sky.png');
}

function create ()
{
	this.add.sprite(0,0,'sky').setOrigin(0,0);
}

function update ()
{
}



//Classe memória
class Memoria{
	constructor(numerodelinhas,tamanhodaslinhas){
        this.numerodelinhas = numerodelinhas;
        this.tamanhodaslinhas = tamanhodaslinhas;
        this.memoria = [];
        for(var a = 0;a<numerodelinhas; a++){
            this.memoria.push([]);
            for(var b = 0; b<tamanhodaslinhas;b++){
                this.memoria[a].push(null);
            }
        }
        this.flagalocacao = true;
    }
    removePeca(p){
        if (p!=null) {
            for (let i = 0; i < this.numerodelinhas; i++) {
                for (let f = 0; f < this.tamanhodaslinhas; f++) {
                    if (this.memoria[i][f] === p) {
                        this.memoria[i][f] = null;
                    }
                }
            }
            return true;
        }
        return false;
	}
	//Função adicional que remove uma peça com base na posição indicada e 
	//retorna a peça que foi removida
    removePeca_porposicao(linha,posicao){
        let temp = null;
        if(this.memoria[linha][posicao] != null){
            temp = this.memoria[linha][posicao];
            for (let i = 0; i <this.tamanhodaslinhas; i++) {
                if (this.memoria[linha][i] === temp){
                    this.memoria[linha][i] = null;
                }
            }
        }
        return temp;
    }

    inserePeca(peca,linha,posicao){
        let temp = null;
        if(this.flagalocacao && peca.tamanho+posicao <=10){
            for (let i = posicao; (i<posicao+peca.tamanho) && (temp == null);i++){
                temp = this.memoria[linha][i];
            }
            if(temp == null){
                for (let i = posicao; i < posicao+peca.tamanho; i++) {
                    this.memoria[linha][i] = peca;
                }
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    //Retorna a peça alocada na posição de memoria indicada;
    //Se não houver peça retorna null;
    getPeca(linha,posicao){
        return this.memoria[linha][posicao];
    }
    //Bloqueia a alocação de nova peça para não ocorrer conflito no estado de swap
    bloquarAlocacao(){
        this.flagalocacao = false;
    }
    //Libera a alocação de nova peça
    liberarAlocacao(){
        this.flagalocacao = true;
    }

    //Retirar uma peça da memoria e deleta ela visualmente do jogo
    //A liberação do espaço fisico na memoria do computador é feita pelo garbage colector
    destruirPeca(p){
        this.removePeca(p);
        //resta implementar a remoção visual da peça;
    }       
}