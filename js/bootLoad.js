





class Boot {
  constructor() {
    this.imgSrc = [
      "/Peca.png",
      "/svg/pretas.svg",
      "/svg/brancas.svg",
      "/svg/damaB.svg",
      "/svg/damaP.svg"
    ];
    this.scriptSrc = ["./js/app.js", "/main.js"];
    
    this.img =[];
    
    this.init()
  }
  
  addImg(idx = 0, f){
    if(idx >= this.imgSrc.length){
       return f(idx);
    }
    
    
    const img = new Image();
          img.src = this.imgSrc[idx];
          img.onload = ()=>{
            this.img.push(img)
            this.addImg(idx+1, f)
          }
          img.onerror = ()=>{
            console.log(`erro img >> ${this.imgSrc[idx]}`);
            this.addImg(idx+1, f)
          }
  }
  
  addScript(idx = 0, f) {
      if (idx >= this.scriptSrc.length) {
        return f(idx);
      }
      
      
      const script = document.createElement("script");
            script.src = this.scriptSrc[idx];
            script.onload = () => {
            this.addScript(idx + 1, f)
      }
      script.onerror = () => {
        console.log(`erro script >> ${this.scriptSrc[idx]}`);
        this.addScript(idx + 1, f)
      }
      
      document.body.appendChild(script)
  }
  init(){
    
    
    this.addImg(0, (i)=>{
       this.addScript(0, (e)=>{
         
       })
    })
  }
}


const boot = new Boot();



