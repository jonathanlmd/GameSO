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
	var infoalgoritmo = this.add.text(660, 180, 'bestfit', { fill: '#000000' });
	var infomenu = this.add.text(670, 260, 'MENU', { fill: '#000000' });
	var inforecorde = this.add.text(660, 280, 'Recorde', { fill: '#000000' });
	var inforecordepontos = this.add.text(660, 300, '999', { fill: '#000000' });
	var infopontuacao = this.add.text(660, 320, 'Pontuação', { fill: '#000000' });
	var infopontuacaopontos = this.add.text(660, 340, '40', { fill: '#000000' });
	var infopontuacaopontos = this.add.text(660, 340, '40', { fill: '#000000' });
	
    // paredes do jogo
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
	var par1 = new Phaser.Geom.Rectangle(0, 0, 20, 600);
    graphics.fillRectShape(par1);
	var par2 = new Phaser.Geom.Rectangle(0, 0, 800, 20);
    graphics.fillRectShape(par2);
	var par3 = new Phaser.Geom.Rectangle(780, 0, 20, 600);
    graphics.fillRectShape(par3);
	var par4 = new Phaser.Geom.Rectangle(0, 580, 800, 20);
    graphics.fillRectShape(par4);
	var par5 = new Phaser.Geom.Rectangle(580, 0, 20, 600);
    graphics.fillRectShape(par5);
	var par6 = new Phaser.Geom.Rectangle(600, 140, 200, 20);
    graphics.fillRectShape(par6);
	var par7 = new Phaser.Geom.Rectangle(600, 220, 200, 20);
    graphics.fillRectShape(par7);
	var par8 = new Phaser.Geom.Rectangle(600, 400, 200, 20);
    graphics.fillRectShape(par8);
	
	var novapeca = new Phaser.Geom.Rectangle(0, 0, 40, 40);
	graphics = this.add.graphics({ lineStyle: { color: 0x000000 }, fillStyle: { color: 0xff0000 }  });
	graphics.strokeRectShape(novapeca);
	graphics.fillRectShape(novapeca);
	
	var container = this.add.container(630, 60, [graphics]);
    container.setSize(40, 40);
    container.setInteractive();
    this.input.setDraggable(container);
   
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });
       
	
}

function update ()
{
	
}

//Classe peça
class Peca{
    constructor(tamanho){
        this.tamanho = tamanho;
    }
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
    //Remove a peça especificada
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
    //insere a peça especificada na linha e posicao desejada
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

function criarEExibirPeca(){
    var novapeca = new Phaser.Geom.Rectangle(0, 0, 40, 40);
    var graphics = this.add.graphics({ lineStyle: { color: 0x000000 }, fillStyle: { color: 0xff0000 }  });
    graphics.strokeRectShape(novapeca);
    graphics.fillRectShape(novapeca);

    var container = this.add.container(630, 60, [graphics]);
    container.setSize(40, 40);
    container.setInteractive();
    this.input.setDraggable(container);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });
}

function sortearTamanhoCorEAlgoritmo(){
        let i = Math.floor(Math.random() * 5);
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
        i = Math.floor(Math.random() * 2);
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

//Função BestFit retorna um vetor de 3 posições com as melhores posições para alocar a peça
//1 posição são indices de linha e 2 posição são indices de onde iniciam os espaços vazios em cada linha
//3 posição é o tamanho do melhor espaço
//Ex.: [[0,3],[2,5],3] significa que o tamanho do melhor espaço é 3 e existem dois 
//espaços na matriz com esse tamanho, um na linha 0 posição 2 e outro na linha 3 posição 5
function bestFit(peca,mem){
    let melhorescolha = [[],[],mem.tamanhodaslinhas];
    let min = peca.tamanho;
    let inicio = 0;
    let tam = 0;
    for (let k = 0; k < mem.numerodelinhas; k++) {
        for (let i = 0; i < mem.tamanhodaslinhas; i++) {
            if(mem.memoria[k][i] == null){
                inicio = i;
                let j;
                for (j = i; j < mem.tamanhodaslinhas && mem.memoria[k][j] == null; j++) {
                    tam++;
                }
                i = j;
            }
            if(tam >= min){
                if(tam == melhorescolha[2]){
                    melhorescolha[0].push(k);
                    melhorescolha[1].push(inicio);
                }
                if (tam < melhorescolha[2]) {
                    melhorescolha[0] = [k];
                    melhorescolha[1] = [inicio];
                    melhorescolha[2] = tam;
                }
            }
            inicio = 0;
            tam = 0;
        }
    }
    return melhorescolha;
}