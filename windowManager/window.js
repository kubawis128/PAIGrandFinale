export class Window{
    constructor(x,y,width,height,title,rend){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.holdingX = x
        this.holdingY = y
        this.title = title;
        this.canvas = document.createElement("canvas")
        document.getElementsByTagName("body")[0].appendChild(this.canvas)
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.left = x + "px";
        this.canvas.style.top = (y-30)+60 + "px"; 
        this.renderer = rend

    }
    
    draw(ctx){
        // Main window
        ctx.fillStyle = "#414348"
        ctx.fillRect(this.x, this.y, this.width, this.height)

        // Tile Bar
        ctx.fillStyle = "#696969"
        ctx.fillRect(this.x, this.y, this.width, 30)

        // Window Title
        ctx.font = "24px Minecraft";
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(this.title, this.x+(this.width/2)-(ctx.measureText(this.title).width/2), this.y+24);

        // Close Button and it's text
        ctx.fillStyle = "#DF2E38"
        ctx.fillRect(this.x+this.width-30, this.y+2, 26, 26)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("X", this.x+this.width-30+(ctx.measureText("X").width/2), this.y+24);

        ctx.fillStyle = "#3E54AC"
        ctx.fillRect(this.x+this.width-60, this.y+2, 26, 26)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("_", this.x+this.width-60+(ctx.measureText("_").width/2), this.y+24);
    }

    destroy(){
        console.log("destroy called quitting")
        console.log("instance: ",this)
        console.log("instance: ",this.instance)

        if(this.instance){
            this.instance.destroy()
            
        }
        document.body.removeChild(this.canvas)
    }

    destroyUI(){
        this.renderer.window_list.pop(window)
        document.body.removeChild(this.canvas)
    }
    
    setHolding(x,y){
        this.holdingX = x
        this.holdingY = y
        this.canvas.style.left = this.x + "px";
        this.canvas.style.top = (this.y-30)+60 + "px"; 
    }
}