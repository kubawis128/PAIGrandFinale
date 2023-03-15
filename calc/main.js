export class Calc {
    constructor(canvas){
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
    }

    draw(){
        // Background
        this.ctx.fillStyle = "#3f3f3f"
        
        // History of calculations
        this.ctx.beginPath()
        this.ctx.roundRect(0,0,this.canvas.width,this.canvas.height/4,4)
        this.ctx.fill()

        // Current expression
        this.ctx.fillStyle = "#3f3f3f"
        this.ctx.beginPath()
        this.ctx.roundRect(0,this.canvas.height/4 + 2,this.canvas.width,this.canvas.height/6,4)
        this.ctx.fill()

        // Buttons
        this.ctx.fillStyle = "#3f3f3f"
        this.ctx.beginPath()
        this.ctx.roundRect(0,220,this.canvas.width,this.canvas.height - 220,4)
        this.ctx.fill()

    }
    destroy(){
        console.log("Bye  From calc")
    }
}