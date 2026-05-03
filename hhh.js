class Tabuleiro {
  constructor() {
      this.li = 9;
      this.co = 9;
      this.size = 40;
      this.offset = 40;
      this.cell ={x: -1, y: -1}
      this.peca = {x: -1, y: -1};
      //this.pioes = [];
      this.spritePiaoB = {sx: 111,sy: 247,sw: 80,sh: 80};
      this.spritePiaoP = {sx: 111,sy: 706, sw: 80, sh: 80};
      this.letras = "ABCDEDGH";
      this.selet = null;
      this.vez = 1;
      
      this.pioes = [];
      this.posivel =[];
      this.capitura = {
         cap: false,
         frente: null,
      };
      
      
      
      for(var x = 0; x < 8; x++) {
        for(var y = 0; y < 3; y++) {
          const is = (x+y) % 2 === 1;
        
          if(is) {
            this.pioes.push({
               x: x,
               y: y +5,
               time: 1
            })
          }
          else{
            this.pioes.push({
              x: x,
              y: y,
              time: 2
            })
          }
          
        }
      }
      
      
      
      ctx.canvas.width        = this.li*this.size;
      ctx.canvas.height       = this.co*this.size;
      ctx.canvas.style.width  = this.li*this.size + "px";
      ctx.canvas.style.height = this.co*this.size + "px";
      
      this.Event();
  }
  
  /*Event(){
    ctx.canvas.addEventListener("pointerdown", (e)=>{
        const rect = ctx.canvas.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        
        const cell = this.getCoordenadas(x,y)
        
        if(!cell) return;
        
        
        
        this.cell = cell;
        this.peca = this.getPeca(cell.x, cell.y)
        
        
        
        ///selecionar 
        if (!this.selet && this.peca) {
            this.selet = this.peca;
            if(this.selet.time !== this.vez)  return;
            
            
            this.posivel = [];
            
            const p = this.selet;
            
            
            
            // 👉 direção baseada no time
            const dir = (p.time === 1) ? -1 : 1;
            
            const moves = [
              { x: p.x + 1, y: p.y + dir },
              { x: p.x - 1, y: p.y + dir }
            ];
            
            
            const capitura = (p.dama) ?
                [
                  { x: 2, y: 2 },
                  { x: -2, y: 2 },
                  { x: 2, y: -2 },
                  { x: -2, y: -2 }
                ] :
                [
                  { x: 2, y: dir * 2 },
                  { x: -2, y: dir * 2 }
                ];

            
            
                        
            for(let m of moves) {
              if (m.x < 0 || m.x > 7 || m.y < 0 || m.y > 7) continue;
              
              // si tiver vazio
              if(!this.getPeca(m.x,m.y)){
                this.posivel.push(m)
              }
            }
            
            
            ///Capitura
            for(let c of capitura) {
               const mx = p.x + c.x /2;
               const my = p.y + c.y /2;
               
               // tem peca na frente?
               const alvo = this.getPeca(mx,my);
               // 4 posição posivel  pra capitura 
               const destino ={
                 x: p.x + c.x,
                 y: p.y + c.y
               }
               

               
               // si peca na frente 
               // e tbm si o a peca atual !== da peca selecionada 
               
               
               if(alvo && alvo.time !== p.time && !this.getPeca(destino.x, destino.y)){
                  this.posivel.push({
                       x: destino.x,
                       y: destino.y
                  })
               }
            }
            
            
            const capturas = this.posivel.filter(m =>Math.abs(m.x - p.x) === 2);
            if (capturas.length > 0) {this.posivel = capturas;}
        }
        else{
          const x = this.cell.x;
          const y = this.cell.y;
          
          
          ///verificar mover simples 
          const pode = this.posivel.some(p => p.x === x && p.y === y);
          this.capitura.cap = pode;
          
          
          if(!pode){
            this.posivel = []
            this.selet = null;
            return;
          }
          
          
          const dx = x - this.selet.x
          const dy = y - this.selet.y;
          
          
          let capturou = false;

          if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
            const mx = this.selet.x + dx / 2;
            const my = this.selet.y + dy / 2;
            
            const alvo = this.getPeca(mx, my);
            
            if (alvo && alvo.time !== this.selet.time) {
              this.pioes = this.pioes.filter(p => p !== alvo);
              capturou = true;
            }
          }
          
          // move
          this.selet.x = x;
          this.selet.y = y;
          
          // 👉 só troca turno se NÃO capturou
          if (!capturou) {
            this.vez = this.vez === 2 ? 1 : 2;
          }
          
          this.selet.x = x;
          this.selet.y = y;
          this.posivel = []
          this.selet = null;
          
        }
        
        
      

      
    })
  }*/
  
  Event() {
  ctx.canvas.addEventListener("pointerdown", (e) => {
    const rect = ctx.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cell = this.getCoordenadas(x, y);
    if(!cell) return;
    this.cell = cell;
    this.handleClick(cell);
  });
}
  
 handleClick(cell) {
  const peca = this.getPeca(cell.x, cell.y);

  if (!this.selet) {
    this.selecionar(peca);
  } else {
    this.tentarMover(cell);
  }
}

 getMovimentos(p) {
  let pos = [];
  
  const dir = (p.time === 1) ? -1 : 1;
  
  const moves = [
    { x: p.x + 1, y: p.y + dir },
    { x: p.x - 1, y: p.y + dir }
  ];
  
  const caps = p.dama ?
    [
      { x: 2, y: 2 }, { x: -2, y: 2 },
      { x: 2, y: -2 }, { x: -2, y: -2 }
    ] :
    [
      { x: 2, y: dir * 2 },
      { x: -2, y: dir * 2 }
    ];
  
  // movimento simples
  for (let m of moves) {
    if(this.isDentro(m) && !this.getPeca(m.x, m.y)) {
      pos.push(m);
    }
  }
  
  // captura
  for (let c of caps) {
    const mx = p.x + c.x / 2;
    const my = p.y + c.y / 2;
    
    const alvo = this.getPeca(mx, my);
    const destino = { x: p.x + c.x, y: p.y + c.y };
    
    if (
      alvo &&
      alvo.time !== p.time &&
      this.isDentro(destino) &&
      !this.getPeca(destino.x, destino.y)
    ) {
      pos.push(destino);
    }
  }
  
  // força captura
  const capturas = pos.filter(m => Math.abs(m.x - p.x) === 2);
  return capturas.length > 0 ? capturas : pos;
}

 selecionar(peca) {
  if (!peca || peca.time !== this.vez) return;
  
  this.selet = peca;
  this.posivel = this.getMovimentos(peca);
}
 tentarMover(cell) {
  const pode = this.posivel.some(m => m.x === cell.x && m.y === cell.y);
  
  if (!pode) {
    this.reset();
    return;
  }
  
  const capturou = this.executarMovimento(cell);
  
  if (!capturou) {
    this.trocarTurno();
  }
  
  this.reset();
}
 executarMovimento(cell) {
  const dx = cell.x - this.selet.x;
  const dy = cell.y - this.selet.y;
  
  let capturou = false;
  
  if (Math.abs(dx) === 2) {
    const mx = this.selet.x + dx / 2;
    const my = this.selet.y + dy / 2;
    
    const alvo = this.getPeca(mx, my);
    
    if (alvo) {
      this.pioes = this.pioes.filter(p => p !== alvo);
      capturou = true;
    }
  }
  
  this.selet.x = cell.x;
  this.selet.y = cell.y;
  
  return capturou;
}  
 isDentro(p) {
  return p.x >= 0 && p.x < 8 && p.y >= 0 && p.y < 8;
}

trocarTurno() {
  this.vez = this.vez === 2 ? 1 : 2;
}

reset() {
  this.selet = null;
  this.posivel = [];
}
  
  getPeca(x,y){return this.pioes.find(p => p.x === x && p.y === y);}
  
  
  getCoordenadas(mx,my){
      const x = Math.floor((mx - this.offset) / this.size);
      const y = Math.floor((my - this.offset) / this.size);
      
      
      
      if(x < 0  || x >= 8 || y < 0  || y >= 8) return null;
      return {x,y}
  }
  
  
  
  
  draw(){
    ///// DRAW Tabuleiro 
    for(var x = 0; x < this.li; x++) {
      for(var y = 0; y < this.co; y++) {
        
        const px = this.offset + x * this.size;
        const py = this.offset + y * this.size;
        
        const isCor = (x + y) % 2 === 0;
        
        
        ctx.fillStyle = isCor ? "#769656" : "#EEEED2";
        ctx.fillRect(px,py, this.size, this.size)
        
      }
    }
    
    for(var i = 0; i < this.pioes.length; i++) {
       let p   = this.pioes[i];
       
       const px = this.offset + p.x * this.size;
       const py = this.offset + p.y * this.size;
       
       let o   = p.time === 1 ? this.spritePiaoB : this.spritePiaoP;
       
       
       ctx.drawImage(boot.img[0],
         o.sx,
         o.sy,
         o.sw,
         o.sh,
         px+5,
         py+5,
         30,30
       )
    }
    
    
    ///Add Letras e Número 
    ctx.fillStyle = "#fff"
    for(var i = 0; i < 8; i++) {
       const l = this.letras[i];
       ctx.fillText(l,this.offset + i * this.size + this.size/3,this.offset - 10);     
       ctx.fillText(i+1,this.offset-15, this.offset + i * this.size + this.size/2);     
    }
    
    
    
    
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
    
    
    
  }
  
  

}
