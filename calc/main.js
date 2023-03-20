export class Calc {
    constructor(canvas){
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
    }

    draw(){
        function drawRoundRect(ctx,x,y,width,height,curve){
            ctx.beginPath()
            ctx.roundRect(x,y,width,height,curve)
            ctx.fill()
        }
        // Background
        this.ctx.fillStyle = "#3f3f3f"
        
        // History of calculations
        drawRoundRect(this.ctx,0,0,20,300,4)

        // Current expression
        this.ctx.fillStyle = "#3f3f3f"
        drawRoundRect(this.ctx, 0 , 310, this.canvas.width-6,100,4)

        // Buttons
        this.ctx.fillStyle = "#3f3f3f"
        drawRoundRect(this.ctx,0,420,this.canvas.width-6,this.canvas.height - 220,4)
        
        this.ctx.fillStyle = "#4f4f4f"
        let buttonSize = 78

        for(let x = 0; x < 4; x++){
            for(let y = 0; y < 4; y++){
                console.log("Grid")
                drawRoundRect(this.ctx,(x*buttonSize)+4,(y*buttonSize)+220+4,buttonSize,buttonSize,4)
            }
        }

    }

    destroy(){
        console.log("Bye  From calc")
    }

}