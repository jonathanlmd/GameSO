//Classe peça
class Peca{
    constructor(tamanho, cor){
        this.tamanho = tamanho;
        this.cor = cor;
        this.imagem = null;
        this.graphic = null;
        this.container = null;
        switch (cor) {
            case 0xff0000:
                this.tempoemswap = 3;
                break;
            case 0x00ff00:
                this.tempoemswap = 5;
                break;
            case 0xff0000:
                this.tempoemswap = 7;
                break;
            case 0x5a005a:
                this.tempoemswap = 10;
                break;
            case 0xff8c00:
                this.tempoemswap = 13;
                break;
            default:
                break;
        }
        this.tempodevida = 5 + Math.floor(Math.random() * 8);
        this.flagtempodevida = true;
        this.flagtempoemswap = true;
        this.flagalinhamento = false;
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
    /**
     * Remove a peça especificada
     * @param {objeto peça a ser removida} p 
     */
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
    /**
     * Função adicional que remove uma peça com base na posição indicada e 
     * retorna a peça que foi removida
     * 
     * @param {linha em que a peça a ser removida está alocada} linha 
     * @param {posição da linha em que a peça está alocada} posicao 
     */
	
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
    /**
     * Insere a peça especificada na linha e posicao desejada
     * 
     * @param {peça a ser inserida} peca 
     * @param {linha de inserção da peça} linha 
     * @param {posição onde a peça será inserida} posicao 
     */
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

    /**
     * Retorna a peça alocada na posição de memoria indicada;
     * Se não houver peça retorna null;
     * 
     * @param {linha da posição de memoria} linha 
     * @param {posição na linha de memória} posicao 
     */
    getPeca(linha,posicao){
        return this.memoria[linha][posicao];
    }
    /**
     * Bloqueia a alocação de nova peça para não ocorrer conflito no estado de swap
     */
    bloquarAlocacao(){
        this.flagalocacao = false;
    }
    /**
     * Libera a alocação de nova peça
     */
    liberarAlocacao(){
        this.flagalocacao = true;
    }

    /**
     * Retirar uma peça da memoria e deleta ela visualmente do jogo
     * A liberação do espaço fisico na memoria do computador é feita pelo garbage colector
     * 
     * @param {peça alocada a ser destruida} p 
     */
    destruirPeca(p){
        this.removePeca(p);
        //resta implementar a remoção visual da peça;
    }       
}

var cor;
var tamanho;
var algoritmo;
var pontos;
var novapeca = null;
var memoria = new Memoria(15,15);
//var swap = new Memoria();
var melhorposicao = null;
var estado;
var temporizador;
var flagtemporizador = false;
var tempodecorrido;
var grid;

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

function preload ()
{
    /**
     * Criação do grid de memória principal
     */
    g = this.make.graphics({ x: 0, y: 0, add: false, lineStyle: {color: 0xf0000f}, fillStyle: { color: 0x00ff00, alpha: 1 } });
    g.strokeRect(0, 0, 40, 40);
    g.generateTexture('grid', 40, 40);

    grid = this.add.group({
        classType: Phaser.GameObjects.Image,
        createCallback: function(item){
            item.setInteractive();
            item.input.dropZone = true;
        },
        key: 'grid',
        repeat: 195,
        max: 196,
        active: true,
        hitArea: new Phaser.Geom.Rectangle(0, 0, 40, 40),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        gridAlign: {
            width: 14,
            cellWidth: 40,
            cellHeight: 40,
            x: 40,
            y: 40
        }
    });

    /**
     * Definindo função para arrastar objeto
     */
    this.input.on('drag', function (pointer,gameObject, dragX, dragY) {
        if(!novapeca.flagalinhamento){
            gameObject.x = dragX;
            gameObject.y = dragY;
        }
    });
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

    sortearTamanhoCorEAlgoritmo();
    criarEExibirPeca(this);

}

function update ()
{
    /*
        Estrutura da máquina de estado do jogo
     */
    //Contabilizar o Tempo
        //contarSegundos();
        //decrementarTemporizador();
    //Decrementar tempo de vida de cada peça na memoria
    //Decrementar tempo de peças em Swap
        //decrementarTempoDasPecas();
    //Acrescentar Pontos [se peça for destruida da memoria]
        //acrescentarPontos()
    //Decrementar Pontuação [se cronometro passar de 0]
        //decrementarPontos();
    /* 
        if(pontos <= 0){
            estado = 6;
        }
    */
    switch (estado) {
        case 1:
            //------Iniciar Jogo
            //Exibir Memoria Vazia
            //Exibir Swap Vazia
            //Exibir Cronometro
            //Exibir Pontuação
            // Contagem Regressiva Para Iniciar Jogo
            //estado = 2;
            break;
        case 2:
            //------Mostrar Peça
            //Sorteia tamanho,cor e o algoritmo
                //sortearTamanhoCorEAlgoritmo();
            //Cria e Exibe peça
                //criarEExibirPeca(this);
            //Calcula algoritmo
                /*if (algoritmo == 'Bestfit') {
                    bestFit(novapeca,memoria);
                }else{
                    worstFit();
                }*/
            //Zerar Temporizador
                //resetTemporizador();
            //estado = 3;
            break;
        case 3:
            //------Esperando Jogada
            //Inicia Temporizador
                //flagtemporizador = true;
            //Capturar Ação do jogador
            /*if(moveupecapramemoria){
                estado = 2;
            }
            if(moveupecadaswappramemoria){
                estado = 5;
            }
            if(moveupecadamemoriapraswap){
                estado = 4;
            }*/
            break;
        case 4:
            //------Fazer SwapOut
            //Parar tempo de vida da swap
            //Iniciar cronometro da peça na swap
            //Decrementar pontos do jogador
            break;
        case 5:
            //------Fazer SwapIn
            //Zerar cronometro da peça na swap
            //Continuar contagem do tempo de vida da peça
            //Bloquear alocação de novas peças
            break;
        case 6:
            //------Fim de Jogo
            //Exibir fim de jogo
            //Mostrar Pontuação
            break;
        default:
            break;
    }	
}

/**
 * Função responsável por sortear Tamanho Cor e Algoritmo para a proxima peca a ser exibida
 * Os valores são armazenados nas variaveis globais cor tamanho e algoritmo
 */
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
    //var infoalgoritmo = this.add.text(660, 180, algoritmo, { fill: '#000000' });
}


/**
 * Função responsável por instanciar e exibir uma nova peça com base nas informações das variaveis
 * cor e tamanho
 * 
 * @param {parametro que recebe o contexto do pelo qual está sendo chamado} scene 
 */
function criarEExibirPeca(scene){   
    novapeca = new Peca(tamanho,cor);
    novapeca.graphic = scene.make.graphics({ x: 0, y: 0, add: false, lineStyle: { color: 0x000000}, fillStyle: { color: 0xff0000, alpha: 1 } });
    novapeca.graphic.fillRect(0, 0, novapeca.tamanho, 40);
    novapeca.graphic.generateTexture('peca', novapeca.tamanho, 40);
    novapeca.imagem = scene.add.image(630, 60, 'peca').setOrigin(0,0);
    novapeca.imagem.name = 'novapeca';
    novapeca.imagem.peca = novapeca;
    novapeca.imagem.setInteractive();
    scene.input.setDraggable(novapeca.imagem);
    scene.children.bringToTop(novapeca.imagem);

    novapeca.imagem.on('dragenter',function (pointer,target) {
        this.peca.flagalinhamento = true;
    });

    novapeca.imagem.on('dragover',function (pointer,target) {
        this.setPosition(target.getTopLeft().x, target.getTopLeft().y);
    });

    novapeca.imagem.on('dragover',function (pointer,target) {
        this.setPosition(target.getTopLeft().x, target.getTopLeft().y);
    });

    novapeca.imagem.on('dragleave', function (pointer, target) {
        this.peca.flagalinhamento = false;
    });

    novapeca.imagem.on('pointerup', function (pointer) {
        if(this.peca.flagalinhamento == false){
            this.setPosition(630, 60);
        }
    });

    novapeca.imagem.on('drop',function (pointer, target) {
        console.log(target);
    });
}

/**
 * Função BestFit retorna um vetor de 3 posições com as melhores posições para alocar a peça
 * 1 posição são indices de linha e 2 posição são indices de onde iniciam os espaços vazios em cada linha
 * 3 posição é o tamanho do melhor espaço
 * Ex.: [[0,3],[2,5],3] significa que o tamanho do melhor espaço é 3 e existem dois 
 * espaços na matriz com esse tamanho, um na linha 0 posição 2 e outro na linha 3 posição 5
 */
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

function decrementarPontos(pts){
    pontos -= pts;
}
