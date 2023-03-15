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
        this.canvas.style.top = y+30 + "px"; 
        this.renderer = rend
        this.uuid = this.generatePseudoRandomUUID()
        this.canvas.style.scale = 1
    }
    
    draw(ctx){
        // Main window
        ctx.fillStyle = "#414348"
        ctx.fillRect(this.x-3, this.y, this.width+6, this.height+33)

        // Tile Bar
        ctx.fillStyle = "#696969"
        ctx.fillRect(this.x-3, this.y, this.width+6, 30)

        // Window Title
        ctx.font = "24px Minecraft";
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(this.title, this.x+(this.width/2)-(ctx.measureText(this.title).width/2), this.y+24);

        // Close Button and it's text
        ctx.fillStyle = "#DF2E38"
        ctx.fillRect(this.x+this.width-30, this.y+2, 26, 26)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("X", this.x+this.width-30+(ctx.measureText("X").width/2), this.y+24);

        // Minimize Button
        ctx.fillStyle = "#3E54AC"
        ctx.fillRect(this.x+this.width-60, this.y+2, 26, 26)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("_", this.x+this.width-60+(ctx.measureText("_").width/2), this.y+24);
        if(this.instance){
            if(this.instance.draw){
                this.instance.draw()

            }
        }
    }
    drawRounded(ctx){
        console.log("Try to draw rounded windows")
        // Main window
        ctx.fillStyle = "#414348"
        ctx.beginPath()
        ctx.roundRect(this.x-3, this.y, this.width+6, this.height+33,24)
        ctx.fill()

        // Tile Bar
        ctx.fillStyle = "#696969"
        ctx.beginPath()
        ctx.roundRect(this.x-3, this.y, this.width+6, 30,24)
        ctx.fill()

        // Window Title
        ctx.font = "24px Minecraft";
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(this.title, this.x+(this.width/2)-(ctx.measureText(this.title).width/2), this.y+24);

        // Close Button and it's text
        ctx.fillStyle = "#DF2E38"
        ctx.beginPath()
        ctx.roundRect(this.x+this.width-30, this.y+2, 26, 26,4)
        ctx.fill()
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("X", this.x+this.width-30+(ctx.measureText("X").width/2), this.y+24);

        // Minimize Button
        ctx.fillStyle = "#3E54AC"
        ctx.beginPath()
        ctx.roundRect(this.x+this.width-60, this.y+2, 26, 26,4)
        ctx.fill()
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("_", this.x+this.width-60+(ctx.measureText("_").width/2), this.y+24);
        if(this.instance){
            if(this.instance.draw){
                this.instance.draw()
            }
        }
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
        //document.body.removeChild(this.canvas)
        this.renderer.closeWindow(this)
    }
    
    setHolding(x,y){
        this.holdingX = x
        this.holdingY = y
        this.canvas.style.left = this.x + "px";
        this.canvas.style.top = (this.y-30)+60 + "px"; 
    }
    generatePseudoRandomUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}