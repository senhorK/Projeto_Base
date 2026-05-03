



class Tabuleiro {
  constructor() {
    this.li        = 9;
    this.co        = 9;
    this.size      = 40;
    this.offset    = 40;
    this.pedras    = [];
    
    
    this.cell      = {x: 0, y: 0}
    this.selet     = null;
    this.vez       = 1;
    this.posivel   = [];
    this.Intercepitado = false;
    this.forcaCapi     = true;
    this.forcaCapturaGlobal = true; // ou false
    
    this.spritePiaoB = { sx: 111, sy: 247, sw: 80, sh: 80 };
    this.spritePiaoP = { sx: 111, sy: 706, sw: 80, sh: 80 };
    
    this.resizeCanvas();
    this.addPedras();
    
    
    ctx.canvas.addEventListener("pointerdown", (e)=>{
       const rect = ctx.canvas.getBoundingClientRect();
       const x    = e.clientX - rect.left;
       const y    = e.clientY - rect.top;
       
       const cell = this.getCoordenadas(x,y);
       if(!cell) return;
       
       this.cell   = cell;
       const pedra = this.getPedra(cell.x, cell.y) 
       
       
      if (!this.selet) {
        if (!pedra) return;
        if (pedra.time !== this.vez) return;
        
        this.selet = pedra;
        this.getMove(pedra);
      }
      else {
        // 🔥 impede trocar peça no meio
        if (pedra && pedra.time === this.selet.time) {
          this.selet = pedra;
          this.getMove(pedra);
          return;
        }
        
        this.Capitura(cell);
      }
       
       
    })  
  
    
  }
  
  
  
  
  
  dama(p){
    const direcoes = [
          { dx: 1, dy: 1 },
          { dx: -1, dy: 1 },
          { dx: 1, dy: -1 },
          { dx: -1, dy: -1 }
    ];
    
    
    if(p.dama){
      for(let d of direcoes) {
         let i                = 1;
         let encontrouInimigo = false;
         
         
         
         while (true){
          // 4 posição     
          //   ⬜      ⬜
          //       ♟️
          //   ⬜      ⬜
          //   alvo
          const nx = p.x + d.dx * i;
          const ny = p.y + d.dy * i;
          
          /// si tiver fora quebro o loop
          if(!this.isDentro({x: nx, y: ny})) break;
          
          // inimigos próximo 
          const alvo = this.getPedra(nx, ny)
          
          // si o caminho tinha livre eu corro livre 
          if(!alvo && !encontrouInimigo){
              this.posivel.push({x: nx, y: ny});
              i++;
              continue;
          }
          
          // si tiver inimigos na minha reta 
          if(alvo && alvo.time !== p.time && !encontrouInimigo){
             
             // validar si tem mas caminho vazinho pos 
             const cx = nx + d.dx;
             const cy = ny + d.dy;
             
             if(!this.isDentro({x: cx, y: cy})) break;
             encontrouInimigo = true;
             i++;
             continue;
          }
          
          // adiciona depos do inimigo
          if(!alvo && encontrouInimigo){
            this.posivel.push({x: nx, y: ny});
            i++;
            continue;
          }
          
          break;
         }
      }
      
      return;
    }
    
    
  }
  peao(p){
     const dir = p.time === 1 ? -1 : 1;

     const direcoes = [
           { dx: 1, dy: 1 },
           { dx: -1, dy: 1 },
           { dx: 1, dy: -1 },
           { dx: -1, dy: -1 }
    ]; 
    
    
    
    
      // 🟢 =====================
  // PEÇA NORMAL
  // ======================
  
  const capturas = [];
  const movimentos = [];
  
  
    for (let d of direcoes) {
    const nx = p.x + d.dx;
    const ny = p.y + d.dy;
    
    if (!this.isDentro({ x: nx, y: ny })) continue;
    
    const alvo = this.getPedra(nx, ny);
    const frente = (d.dy === dir);
    
    // 🟢 movimento
    if (!alvo && frente) {
      movimentos.push({ x: nx, y: ny });
    }
    
    // 🔴 captura
    else if (alvo && alvo.time !== p.time) {
      const destino = {
        x: p.x + d.dx * 2,
        y: p.y + d.dy * 2
      };
      
      if (
        this.isDentro(destino) &&
        !this.getPedra(destino.x, destino.y)
      ) {
        capturas.push(destino);
      }
    }
  }
  
    // 🔥 prioridade de captura
   this.posivel = capturas.length > 0 ? capturas : movimentos;
  }
  
  
  
  getMove(p) {
      this.posivel = [];
  
      // 👑 e ♟️ =====================
      // DAMA
      // PEAO
      // ======================
      //this.dama(p);
      //this.peao(p);
      
      
      if (p.dama) {
        this.dama(p);
      } 
      else {
        this.peao(p);
      }
  }
  
  isCapturaMove(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const stepX = dx / Math.abs(dx);
  const stepY = dy / Math.abs(dy);

  let x = from.x + stepX;
  let y = from.y + stepY;

  while (x !== to.x && y !== to.y) {
    const alvo = this.getPedra(x, y);

    if (alvo && alvo.time !== this.selet.time) {
      return true; // 🔥 TEM captura real
    }

    x += stepX;
    y += stepY;
  }

  return false;
}
  Capitura(cell) {
  
    const pode = this.posivel.some(p => p.x === cell.x && p.y === cell.y);
    if (!pode) {
      this.posivel = [];
      this.selet = null;
      return alert("posição errada ");
    }
  
    let capturou = false;
  
    const dx = cell.x - this.selet.x;
    const dy = cell.y - this.selet.y;
  
    // 🔴 captura (funciona pra normal + dama)
    if (Math.abs(dx) >= 2 && Math.abs(dy) >= 2) {
  
      const stepX = dx / Math.abs(dx);
      const stepY = dy / Math.abs(dy);
  
      let x = this.selet.x + stepX;
      let y = this.selet.y + stepY;
  
      while (x !== cell.x && y !== cell.y) {
        const alvo = this.getPedra(x, y);
  
        if (alvo && alvo.time !== this.selet.time) {
          this.pedras = this.pedras.filter(p => p !== alvo);
          capturou = true;
          break;
        }
  
        x += stepX;
        y += stepY;
      }
    }
  
    // 🟢 move
    this.selet.x = cell.x;
    this.selet.y = cell.y;
  
    // 👑 promoção
    if (!this.selet.dama) {
      if (this.selet.time === 1 && this.selet.y === 0) this.selet.dama = true;
      if (this.selet.time === 2 && this.selet.y === 7) this.selet.dama = true;
    }
    
    
    
    
    
    // 🔥 continuar captura (combo)
if (capturou) {
  this.getMove(this.selet);
  
  //const maisCapturas = this.posivel.filter(m => Math.abs(m.x - this.selet.x) >= 2);
  const maisCapturas = this.posivel.filter(m => this.isCapturaMove(this.selet, m));
  
  if (maisCapturas.length > 0) {
    this.posivel = maisCapturas;
    return;
  }
}

// 👇 troca turno com segurança
const jogadorAtual = this.selet.time;
this.vez = jogadorAtual === 2 ? 1 : 2;

this.posivel = [];
this.selet = null;
  
    // 🔥 continuar captura (combo)
   /* if (capturou) {
      this.getMove(this.selet);
  
      const maisCapturas = this.posivel.filter(m => Math.abs(m.x - this.selet.x) >= 2);
  
      if (maisCapturas.length > 0) {
        this.posivel = maisCapturas;
        return; // 🚨 continua jogando com a mesma peça
      }
    }
    
    this.vez =  this.selet.time === 2 ? 1:2;
    this.posivel = [];
    this.selet = null;*/
  }


  
  resizeCanvas(){
    ctx.canvas.width        = this.li*this.size;
    ctx.canvas.height       = this.co*this.size;
    ctx.canvas.style.width  = this.li*this.size +"px";
    ctx.canvas.style.height = this.co*this.size +"px";


    
  }
  addPedras() {
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 3; y++) {
          
          // time de cima
          if ((x + y) % 2 === 0) {
            this.pedras.push({
              x,
              y,
              time: 2,
              dama: false,
              img: boot.img[1],
              imgD: boot.img[4]
            });
          }
          
          // time de baixo (espelhado corretamente)
          const y2 = y + 5;
          
          if ((x + y2) % 2 === 0) {
            this.pedras.push({
              x,
              y: y2,
              time: 1,
              dama: false,
              img: boot.img[2],
              imgD: boot.img[3]
            });
          }
        }
      }
     
     
    
    }
    
    
  
  getCapturaDirecoes(p) {
  const dirs = [
    { dx: 1, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: -1 }
  ];
  
  let capturas = [];
  
  for (let d of dirs) {
    const nx = p.x + d.dx;
    const ny = p.y + d.dy;
    
    const alvo = this.getPedra(nx, ny);
    
    if (alvo && alvo.time !== p.time) {
      const cx = nx + d.dx;
      const cy = ny + d.dy;
      
      if (!this.getPedra(cx, cy)) {
        capturas.push(d); // 👈 guarda a DIREÇÃO
      }
    }
  }
  
  return capturas;
}
    
    
    
  
  
  
  isDentro(p) {return p.x >= 0 && p.x < 8 && p.y >= 0 && p.y < 8;}
  getCoordenadas(mx,my){
       const x = Math.floor((mx - this.offset) / this.size);
       const y = Math.floor((my - this.offset) / this.size);
       
       if(x < 0 || x >= 8 || y < 0 || y >= 8) return null;
       
       return {x,y};
  }
  getPedra(x,y){return this.pedras.find(p => p.x === x && p.y === y);}
  
  
  draw(){
    //draw tabuleiro 
     for(var x = 0; x < this.li; x++) {
         for(var y = 0; y < this.co; y++) {
           
           const px = this.offset + x * this.size;
           const py = this.offset + y * this.size;
           
           const isCor = (x + y) % 2 === 0;
           
           ctx.fillStyle = isCor ? "#769656":"#D7D7D7"
           ctx.fillRect(px,py,this.size, this.size)
         }
     }
     // draw Pedras
     for(var i = 0; i < this.pedras.length; i++) {
       const p= this.pedras[i];
       
        const px = this.offset + p.x * this.size;
        const py = this.offset + p.y * this.size;
        let   o  = p.time === 1 ? this.spritePiaoB : this.spritePiaoP;



        const padding = this.size;
        
        if(!p.dama){
          const size = p.img.width * 0.5;
          const offset = (this.size - size) / 2;
          
          
          
          
          ctx.drawImage(
            p.img,
            px-5,
            py-5,
            this.size+10,
            this.size+10
          );
            /*ctx.drawImage(
              boot.img[0],
              o.sx, o.sy, o.sw, o.sh,
              px + padding,
              py + padding,
              this.size - padding * 2,
              this.size - padding * 2
            );*/
        }
        else{
          ctx.drawImage(
            p.imgD,
            px-5,
            py-5,
            this.size+10,
            this.size+10
          );
          
         /* ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          app.draw.text({
            ctx,
            txt: "👑",
            x: px + this.size / 2,
            y: py + this.size / 2,
            font: `${this.size/1.2}px Arial`
          });*/
          /*app.draw.circle({
          ctx,
          x: px + this.size / 2,
          y: py + this.size / 2,
          size: this.size / 3,
          cor: p.cor,
          stroke: "#000"
        });*/
        }
         
        /* */
         
     }
     
     // Draw coordenadas 
     ////Draw  Coordenadas 
     if(this.cell.x >= 0 && this.cell.y >= 0 && this.selet){
        ctx.beginPath();
        ctx.strokeStyle = "#f00";
        ctx.strokeRect(
           this.offset + this.cell.x * this.size,
           this.offset + this.cell.y * this.size,
           this.size,this.size)
      }
     
        //// Draw Possibilidade  de jogadas
        
        
      
     
      ctx.fillStyle = "#6C98FF63";
      for(var i = 0; i < this.posivel.length; i++) {
            let p = this.posivel[i];
            ctx.fillRect(
              this.offset + p.x * this.size,
              this.offset + p.y * this.size,
              this.size,
              this.size
            )
      }
     
     
     /****!!!!!!!!******/
     
    
  }
}





class Dbug {
  constructor() {
      this.bug = document.querySelector(".dbug");
  }
  
  show(tabuleiro){
    this.bug.innerHTML = `
       cell: ${JSON.stringify(tabuleiro.cell, null, 5)} <br>
       selet: ${JSON.stringify(tabuleiro.selet, null, 5)} <br>
       Posivel: ${JSON.stringify(tabuleiro.posivel, null, 5)} <br>
       vez: ${tabuleiro.vez} <br>
       Intercepitado: ${tabuleiro.Intercepitado} <br>
    `
  }
}



var lar = 300;
var alt = 300;
var ctx = document.querySelector("canvas").getContext("2d");    
var tabuleiro;
var bug;




class Super {
  constructor() {
    this.btnNew = document.querySelector(".newGame")
    
    this.init();
    
    this.btnNew.addEventListener("click", ()=>{
      this.newGame();
    })
  }
  
  newGame() {
    tabuleiro = new Tabuleiro()
    bug       = new Dbug()
  }
  update() {}
  
  draw() {
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height)
    tabuleiro.draw();
  }
  
  loop = () => {
    this.update();
    this.draw();
    bug.show(tabuleiro)
    
    
    window.requestAnimationFrame(this.loop)
  }
  
  
  init() {
     
    //
    
    
    this.newGame();
    this.loop();
  }
}


const main = new Super();

