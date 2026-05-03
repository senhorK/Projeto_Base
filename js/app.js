


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Ferramenta de Desenvolvimento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Reduz repetição de código
• Economiza linhas desnecessárias
• Melhora a organização do projeto
• Acelera o desenvolvimento
• Facilita manutenção futura

oetivo:
Criar uma base sólida, reutilizável
e eficiente para desenvolvimento
de jogos e sistemas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/



/**
app.draw.rect({
       ctx,
       x: 10,
       y: 10,
       w: 50,
       h: 50,
       cor: "#0f0" ,
       stroke: "#000",
       strokeW: 5
     })
     app.draw.arc({
       ctx,
       x: 100, 
       y: 100,
       size: 25,
       cor: "#829",
       stroke: "#000",
       strokeW: 5
     })
     app.draw.line({
       ctx,
       x1: 100,
       y1: 400,
       x2: 300,
       y2: 150,
       cor: "#000",
       w: 1
     })
     app.draw.text({
       ctx,
       txt: "erick",
       x: 200,
       y: 100,
       cor: "#000",
       font: "20px Arial"
     })
     app.draw.circle({
       ctx,
       cor: "#023",
       x: 200,
       y: 200,
       size: 30,
       stroke: "#f10"
     })
     app.draw.triangle({
       ctx,
       x: 300, y: 200,
       size: 40
     })
**/


class Draw{
  constructor() {
    
  }
  
  rect(o     = {}) {
    const { ctx, x, y, w, h, cor = "#000", stroke = null, strokeW = 1 } = o;
    
  
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, w, h);
    
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeW;
      ctx.strokeRect(x, y, w, h);
    }
  }
  arc(o      = {}) {
    const { ctx, x, y, size, cor = "#000", stroke = null, strokeW = 1, start = 0, end = Math.PI * 2 } = o;
    
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.arc(x, y, size, start, end);
    ctx.fill();
    
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeW;
      ctx.stroke();
    }
  }
  text(o     = {}) {
    const { ctx, txt, x, y, cor = "#000", font = "20px Arial" } = o;
    
    ctx.fillStyle = cor;
    ctx.font = font;
    ctx.fillText(txt, x, y);
  }
  line(o     = {}) {
    const { ctx, x1, y1, x2, y2, cor = "#000", w = 1 } = o;
    
    ctx.beginPath();
    ctx.strokeStyle = cor;
    ctx.lineWidth = w;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  triangle(o = {}) {
      const { ctx, x, y, size = 20, cor = "#000", stroke = null, w = 1 } = o;
      
      const h = size;
      
      ctx.beginPath();
      ctx.fillStyle = cor;
      
      ctx.moveTo(x, y - h); // topo
      ctx.lineTo(x - size, y + h); // esquerda
      ctx.lineTo(x + size, y + h); // direita
      ctx.closePath();
      ctx.fill();
      
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = w;
        ctx.stroke();
      }
    }
  circle(o   = {}) {
      const { ctx, x, y, size = 20, cor = "#000", stroke = null, w = 1 } = o;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = cor;
      
      ctx.fill();
      
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = w;
        ctx.stroke();
      }
    }
  

  
}
class Physics {
  constructor() {
    
  }
  
  

  inertia(o = {}) {
    const {
      target, // objeto que vai mover
      inputX = 0,
      inputY = 0,
      acc = 0.02,
      drag = 0.95,
      maxSpeed = 5
    } = o;
    
    // cria vx/vy se não existir
    if (target.vx == null) target.vx = 0;
    if (target.vy == null) target.vy = 0;
    
    // aceleração
    target.vx += inputX * acc;
    target.vy += inputY * acc;
    
    // atrito
    target.vx *= drag;
    target.vy *= drag;
    
    // limite total de velocidade
    const speed = Math.sqrt(
      target.vx * target.vx +
      target.vy * target.vy
    );
    
    if (speed > maxSpeed) {
      const ratio = maxSpeed / speed;
      target.vx *= ratio;
      target.vy *= ratio;
    }
    
    // mover
    target.x += target.vx;
    target.y += target.vy;
  }
}
class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.smooth = 0.1; // Suavização
    this.target = null;
    this.limites = false;
  }
  
  follow(o){this.target = o;}
  
  isVisible(obj) {
  return (
    obj.x + obj.w > this.x &&
    obj.x < this.x + obj.ctx.canvas.width &&
    obj.y + obj.h > this.y &&
    obj.y < this.y + obj.ctx.canvas.height
  );
}
  
  
  update(ctx) {
    if (!this.target) return;
    
    
    let x = (this.target.x + (this.target.w / 2)) - (ctx.canvas.width / 2);
    let y = (this.target.y + (this.target.h / 2)) - (ctx.canvas.height / 2);
    
    /**Camera suaver**/
    this.x += (x - this.x) * this.smooth;
    this.y += (y - this.y) * this.smooth;
    
    
    if(this.limites) {
        this.x = Math.max(0,Math.min(mundo.w - ctx.canvas.width, this.x));
        this.y = Math.max(0,Math.min(mundo.h - ctx.canvas.height, this.y));
    }
  
    
    //app.draw.text({ ctx, txt: `vx:${x}`, x: 20, y: 20, cor: "#fff", font: "10px" })
    //app.draw.text({ ctx, txt: `vy:${y}`, x: 20, y: 40, cor: "#fff", font: "10px" })
  }
  isVisible() {}
  
  begin(ctx){
        ctx.save();
        ctx.translate(-this.x, -this.y);
  }
  end(ctx){ctx.restore(); }
}

 
class Engine{
  constructor() {
    
    //*****Modulo 1 desenho no canvas*******//
    this.draw  = new Draw();
    /****Modulo de Physics ***********/
    this.physics = new Physics();
    /**** Modulo de Camera ********/
    this.camera  = new Camera();
  }
}


const app = new Engine();


