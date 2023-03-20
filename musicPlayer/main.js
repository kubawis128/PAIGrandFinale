export class MusicPlayer {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
        this.assetManager = assetManager
    }

    draw(){

        let yOffset = 0;
        // Background
        this.ctx.fillStyle = "#3f3f3f"
        
        
        yOffset += this.canvas.height/20
        this.ctx.fillStyle = "#ff0000"
        this.ctx.beginPath()
        this.ctx.roundRect(this.canvas.width/3, yOffset, this.canvas.width/3,this.canvas.width/3,5) 
        this.ctx.closePath()
        this.ctx.save()
        this.ctx.clip();
        this.ctx.drawImage(this.assetManager.assets.music.glamour ,this.canvas.width/3, yOffset, this.canvas.width/3,this.canvas.width/3)
        this.ctx.restore();

        yOffset += this.canvas.width/3
        this.ctx.font = "32px Minecraft";
        this.ctx.fillStyle = "#FFFFFF"
        let textSize = this.ctx.measureText("Death By Glamour")
        yOffset += 32
        this.ctx.fillText("Death By Glamour", (this.canvas.width/2)-textSize.width/2, yOffset);

        this.ctx.font = "16px Minecraft";
        textSize = this.ctx.measureText("1:11/3:13")
        yOffset += 6 + 16
        this.ctx.fillText("1:11/3:13", (this.canvas.width/2)-textSize.width/2, yOffset);
        yOffset += 8

        let icons = ["arrow_back", "chevron_left", "pause" , "chevron_right" , "arrow_forward"]
        
        this.ctx.font = "32px Material Symbols Outlined";
        icons.forEach((icon,index) => {
            this.ctx.fillStyle = "#3f3f3f"
            let x = (this.canvas.width/8 * (index+1)) + Math.abs(((this.canvas.width/8)*6) / (icons.length - this.canvas.width/8)) * (index+1)
            this.roundRect(this.ctx, x, yOffset, this.canvas.width/8,this.canvas.width/8,32)
            this.ctx.fillStyle = "#FFFFFF"
            this.ctx.fillText(icon, x + this.ctx.measureText(icon).width/4, yOffset + 32 + 8);
        })
        this.buttonLocationY = yOffset
    }

    destroy(){
        console.log("Bye  From Musish")
    }

    roundRect(ctx,x,y,width,height,round){
        ctx.beginPath()
        ctx.roundRect(x,y,width,height,round)
        ctx.fill()
    }

    handleClick(x,y){
        for(let index = 0; index < 5; index++){
            let buttonX = (this.canvas.width/8 * (index+1)) + Math.abs(((this.canvas.width/8)*6) / (5 - this.canvas.width/8)) * (index+1)
            if(y > this.buttonLocationY && y < this.buttonLocationY + this.canvas.width/8 && x > buttonX && x < buttonX + this.canvas.width/8){
                console.log("Clicked button ", index)
            }
        }
    }
}