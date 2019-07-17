//Classe peça
class Peca{
    constructor(tamanho, cor){
        this.tamanho = tamanho;
        this.cor = cor;
        this.imagem = null;
        this.origem = {x: 630,y: 60};
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
        this.tempodevida = 20 + Math.floor(Math.random() * 8);
        this.flagtempodevida = false;
        this.flagtempoemswap = false;
        this.flagalinhamento = false;
        this.flagalocada = false;
    }
}

//Classe memória
class Memoria{
	constructor(nome,numerodelinhas,tamanhodaslinhas){
        this.nome = nome;
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
     * @param {Peca} p - objeto peça a ser removida
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
     * @param {number} linha -linha em que a peça a ser removida está alocada
     * @param {number} posicao - posição da linha em que a peça está alocada
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
     * @param {Peca} peca - peça a ser inserida
     * @param {number} linha - linha de inserção da peça
     * @param {number} posicao - posição onde a peça será inserida
     */
    inserePeca(peca,linha,posicao){
        let temp = null;
        if(this.flagalocacao && peca.tamanho/40+posicao <=14 && peca.alocada == null){
            for (let i = posicao; (i<posicao+peca.tamanho/40) && (temp == null);i++){
                temp = this.memoria[linha][i];
            }
            if(temp == null){
                for (let i = posicao; i < posicao+peca.tamanho/40; i++) {
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
     * @param {number} linha - linha da posição de memoria
     * @param {number} posicao - posição na linha de memória
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
     * @param {Peca} p - peça alocada a ser destruida
     */
    destruirPeca(p){
        this.removePeca(p);
        //resta implementar a remoção visual da peça;
    }       
}

var cor;
var tamanho;
var algoritmo;
var pontos = 0;
var novapeca = null;
var memoria = new Memoria('memoriaprincipal',14,14);
var grid;
//var swap = new Memoria('swap',5,5);
//var griSwap;

var infoalgoritmo = null;
var infopontuacaopontos = null;
var melhorposicao;
var temporizador;
var flagtemporizador;
var tempodecorrido = 0;
var relogio;
var timedEvent;

//Variaveis de controle de fluxo
var estado = 1;
var moveupecapramemoria = false;
var moveupecadaswappramemoria = false;
var moveupecadamemoriapraswap = false;

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
    g = this.make.graphics({ x: 0, y: 0, add: false, lineStyle: {color: 0xc0c0c0}, fillStyle: { color: 0xc0c0c0, alpha: 1 } });
    g.strokeRect(0, 0, 40, 40);
    g.generateTexture('grid', 40, 40);

    grid = this.add.group({
        classType: Phaser.GameObjects.Image,
        createCallback: function(item){
            item.setInteractive();
            item.input.dropZone = true;
            item.name = 'memoria';  
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
     * Carregando imagens das peças
     */
    g = this.make.graphics({ x: 0, y: 0, add: false, lineStyle: { color: 0x000000}, fillStyle: { color: 0xff0000, alpha: 1 } });
    g.fillRect(0, 0, 40, 40);
    g.strokeRect(0,0,40,40);
    g.generateTexture('pecavermelhapequena', 40, 40);
    g.clear();
    g.fillRect(0, 0, 80, 40);
    g.strokeRect(0,0,80,40);
    g.generateTexture('pecavermelhamedia', 80, 40);
    g.clear();
    g.fillRect(0, 0, 120, 40);
    g.strokeRect(0,0,120,40);
    g.generateTexture('pecavermelhagrande', 120, 40);
    
    g.fillStyle(0x00ff00, 1);
    g.clear();
    g.fillRect(0, 0, 40, 40);
    g.strokeRect(0,0,40,40);
    g.generateTexture('pecaverdepequena', 40, 40);
    g.clear();
    g.fillRect(0, 0, 80, 40);
    g.strokeRect(0,0,80,40);
    g.generateTexture('pecaverdemedia', 80, 40);
    g.clear();
    g.fillRect(0, 0, 120, 40);
    g.strokeRect(0,0,120,40);
    g.generateTexture('pecaverdegrande', 120, 40);
}

function create ()
{
    // Exibe informações
    relogio = this.add.text(630,120, String(temporizador),{ fill: '#000000' })
    infoalgoritmo = this.add.text(660, 180, '', { fill: '#000000' });
    var infomenu = this.add.text(670, 260, 'MENU', { fill: '#000000' });
    var inforecorde = this.add.text(660, 280, 'Recorde', { fill: '#000000' });
    var inforecordepontos = this.add.text(660, 300, '999', { fill: '#000000' });
    var infopontuacao = this.add.text(660, 320, 'Pontuação:', { fill: '#000000' });
    infopontuacaopontos = this.add.text(660, 340, String(pontos), { fill: '#000000' });
    
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

    //Cria Relogio
    temporizador = 3;
    flagtemporizador = false;
    timedEvent = this.time.addEvent({
        delay: 1000,
        callback: function () {
            tempodecorrido++;
            decrementarTempoDasPecas();
            if (flagtemporizador) {
                temporizador--;
                if(temporizador < 0){
                    decrementarPontos(10);
                }
            }
        },
        timeScale: 1,
        loop: true
    });
}

function update ()
{
    /*
        Estrutura da máquina de estado do jogo
     */
    //Funções realizadas pelo evento timedEvent a cada segundo
        //Contabilizar o Tempo
        //Decrementar tempo de vida de cada peça na memoria
        //Decrementar tempo de peças em Swap
        //Acrescentar Pontos [se peça for destruida da memoria]
        //Decrementar Pontuação [se cronometro passar de 0]


    infopontuacaopontos.setText(pontos);
    relogio.setText(temporizador);
    
     
    if(pontos < 0){
        estado = 6;
    }
    
    switch (estado) {
        case 1:            
            //------Iniciar Jogo
            //Funçõe realizadas em creat
                //Exibir Memoria Vazia
                //Exibir Swap Vazia
                //Exibir Cronometro
                //Exibir Pontuação
            //Ainda falta implementar
            // Contagem Regressiva Para Iniciar Jogo
            estado = 2;
            break;
        case 2:
            //------Mostrar Peça
            //Sorteia tamanho,cor e o algoritmo
                sortearTamanhoCorEAlgoritmo();
            //Cria e Exibe peça
                criarEExibirPeca(this);
            //Calcula algoritmo
                infoalgoritmo.setText(algoritmo);
                if (algoritmo == 'Bestfit') {
                    melhorposicao = bestFit(novapeca,memoria);
                }else{
                    //worsrFit();
                    melhorposicao = bestFit(novapeca,memoria);
                }
            //Zerar Temporizador
                temporizador = 3;
                timedEvent.elapsed = 0;
                flagtemporizador = true;
                estado = 3;
            break;
        case 3:
            //------Esperando Jogada
            //Capturar Ação do jogador
            if(moveupecapramemoria){
                moveupecapramemoria = false;
                //Para temporizador
                flagtemporizador = false;
                estado = 2;
            }
            //Ainda falta implementação SWAP
            /*if(moveupecadaswappramemoria){
                moveupecadaswappramemoria = false;
                estado = 5;
            }
            if(moveupecadamemoriapraswap){
                moveupecadamemoriapraswap = false;
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
            timedEvent.paused = true;
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
}

/**
 * Função responsável por instanciar e exibir uma nova peça com base nas informações das variaveis
 * cor e tamanho
 * 
 * @param {Scene} scene -parametro que recebe o contexto do pelo qual está sendo chamado
 */
function criarEExibirPeca(scene){
    novapeca = new Peca(tamanho,cor);
    if(novapeca.tamanho == 40){
        novapeca.imagem = scene.add.image(630, 60, 'pecavermelhapequena').setOrigin(0,0);
    }
    if(novapeca.tamanho == 80){
        novapeca.imagem = scene.add.image(630, 60, 'pecavermelhamedia').setOrigin(0,0);
    }
    if(novapeca.tamanho == 120){
        novapeca.imagem = scene.add.image(630, 60, 'pecavermelhagrande').setOrigin(0,0);
    }
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

    novapeca.imagem.on('drag', function (pointer, dragX, dragY) {
        if(!this.peca.flagalinhamento){
            this.setPosition(dragX, dragY);
        }
    });

    novapeca.imagem.on('dragleave', function (pointer, target) {
        this.peca.flagalinhamento = false;
    });

    novapeca.imagem.on('pointerup', function (pointer) {
        this.setPosition(this.peca.origem.x,this.peca.origem.y);
    });

    novapeca.imagem.on('drop',function (pointer, target) {
        if(!memoria.inserePeca(this.peca,target.y/40-1,target.x/40-1)){
            this.setPosition(this.peca.origem.x,this.peca.origem.y);
        }else{
            if(target.name == 'memoria'){
                if (this.peca === novapeca) {
                    novapeca.origem = {x: target.getTopLeft().x, y:target.getTopLeft().y};
                    if(verificarAcerto({x: target.y/40-1,y: target.x/40-1},melhorposicao)){
                        acrescentarPontos(15);
                    }else{
                        acrescentarPontos(5);
                    }
                    novapeca.flagtempodevida = true;
                    moveupecapramemoria = true;
                    novapeca = null;                    
                }else{
                    moveupecadaswappramemoria = true;
                }
            }else{
                moveupecadamemoriapraswap = true;
            }
        }
    });
}

/**
 * Função BestFit retorna um vetor de 3 posições com as melhores posições para alocar a peça
 * 1 posição são indices de linha e 2 posição são indices de onde iniciam os espaços vazios em cada linha
 * 3 posição é o tamanho do melhor espaço
 * Ex.: [[0,3],[2,5],3] significa que o tamanho do melhor espaço é 3 e existem dois 
 * espaços na matriz com esse tamanho, um na linha 0 posição 2 e outro na linha 3 posição 5
 * 
 * @param {Peca} peca - peça que será alocada
 * @param {Memoria} mem - memoria em que a peça será alocada
 */
function bestFit(peca,mem){
    let melhorescolha = [[],[],mem.tamanhodaslinhas];
    let min = peca.tamanho/40;
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

/**
 * Função responsável por verificar se a peça foi inserida em uma posição ideal conforme o algoritmo 
 * indicado
 * 
 * @param {Object} posicao - Objeto com posicao x e y das coordenas de onde a peça foi inserida
 * @param {Array} melhorescolha - Array com as melhores escolhas possiveis
 */
function verificarAcerto(posicao,melhorescolha){
    for (let i = 0; i < melhorescolha[0].length; i++) {
        if (melhorescolha[0][i] == posicao.x && melhorescolha[1][i] == posicao.y) {
            return true;        
        }        
    }
    return false;
}


/**
 * Função que decrementa um numero de pontos
 * @param {number} pts 
 */
function decrementarPontos(pts){
    pontos -= pts;
}

/**
 * Função que acrescenta um numero de pontos
 * 
 * @param {number} pts 
 */

function acrescentarPontos(pts){
    pontos += pts;
}

/**
 * Função que decrementa o tempo das peças e remove as da memoria quando acaba o tempo de vida
 */

function decrementarTempoDasPecas(){
    for (let i = 0; i < memoria.numerodelinhas; i++) {
        for (let j = 0; j < memoria.tamanhodaslinhas; j++) {
            if (memoria.memoria[i][j] != null) {
                if(memoria.memoria[i][j].flagtempodevida){
                    memoria.memoria[i][j].tempodevida--;
                    if (memoria.memoria[i][j].tempodevida <= 0) {
                        acrescentarPontos(5);
                        memoria.memoria[i][j].imagem.destroy();
                        for (let k = j+1; memoria.memoria[i][k] === memoria.memoria[i][j]; k++) {
                            memoria.memoria[i][k] = null;
                        }
                        memoria.memoria[i][j] = null;                        
                    }
                }else if(memoria.memoria[i][j].flagtempoemswap){
                    peca.tempoemswap--;
                }
            }   
        }
    }  
}