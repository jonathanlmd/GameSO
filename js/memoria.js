var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#7f7196',
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var cor;
var tamanho;
var algoritmo;

function preload ()
{	
	
}

function create ()
{
	// qual algoritmo
	//var infoalgoritmo = this.add.text(660, 180, 'bestfit', { fill: '#000000' });
	
	// paredes do jogo
	var par1 = new Phaser.Geom.Rectangle(0, 0, 20, 600);
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    graphics.fillRectShape(par1);
	var par2 = new Phaser.Geom.Rectangle(0, 0, 800, 20);
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    graphics.fillRectShape(par2);
	var par3 = new Phaser.Geom.Rectangle(780, 0, 20, 600);
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    graphics.fillRectShape(par3);
	var par4 = new Phaser.Geom.Rectangle(0, 580, 800, 20);
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    graphics.fillRectShape(par4);
	var par5 = new Phaser.Geom.Rectangle(600, 0, 20, 600);
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    graphics.fillRectShape(par5);
	var par6 = new Phaser.Geom.Rectangle(600, 140, 200, 20);
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    graphics.fillRectShape(par6);
	var par7 = new Phaser.Geom.Rectangle(600, 220, 200, 20);
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    graphics.fillRectShape(par7);
	
	
	var novapeca = new Phaser.Geom.Rectangle(640, 80, 40, 40);
	var graphics = this.add.graphics({ fillStyle: { color: cor } });
	graphics.fillRectShape(novapeca);
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
/*
	criarEExibirPeca(){
		var novapeca = new Phaser.Geom.Rectangle(640, 80, tamanho, 40);
		var graphics = this.add.graphics({ fillStyle: { color: cor } });
		graphics.fillRectShape(novapeca);
	}


	sortearTamanhoCorEAlgoritmo(){
			int i = Math.floor(Math.random() * 5);
			//vermelho
			if(i == 0){
				cor = 0xff0000;
			//verde
			}else if(i == 1){
				cor = 0x00ff00;
			//amarelo
			}else if(i == 2){
				cor = 0xff0000;
			//roxo
			}else if(i == 3){
				cor = 0x5a005a;
			//laranja
			}else if(i == 4){
				cor = 0xff8c00;
			}
			i = Math.floor(Math.random() * 2);;
			if(i == 0){
				algoritmo = 'Bestfit';
			}else if(i == 1){
				algoritmo = 'Worstfit';
			}
			i = Math.floor(Math.random() * 3);
			if(i == 0){
				tamanho = 40;
			}else if(i == 1){
				tamanho = 80;
			}else if(i == 2){
				tamanho = 120;
			}		
			var infoalgoritmo = this.add.text(660, 180, algoritmo, { fill: '#000000' });
	}
*/	