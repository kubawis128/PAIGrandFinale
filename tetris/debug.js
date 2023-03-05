export class Debug{

    constructor(canvas){
        this.canvas = canvas
        this.context = canvas.getContext("2d")
        this.clear()
        
    }

    clear(){
        this.context.fillStyle = "#414348"
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    drawCollisionDebug(piece){
        piece.collisions().forEach((row,rIndex) => {
            row.forEach((col,cIndex) => {
                if(col != null && col != ""){
                    if(col == "X"){
                        this.context.fillStyle = piece.color
                        this.context.fillRect((cIndex * 22)+1, (rIndex * 22)+1, 20, 20)
                    }
                    if(col.includes("L")){
                        this.context.fillStyle = "rgba(0,0,255,.5)"
                        this.context.fillRect((cIndex * 22)+1, (rIndex * 22)+1, 20, 20)
                    }
                    if(col.includes("R")){
                        this.context.fillStyle = "rgba(128,128,0,.5)"
                        this.context.fillRect((cIndex * 22)+1, (rIndex * 22)+1, 20, 20)
                    }
                    if(col.includes("D")){
                        this.context.fillStyle = "rgba(0,255,0,.5)"
                        this.context.fillRect((cIndex * 22)+1, (rIndex * 22)+1, 20, 20)
                    }
                    if(col.includes("U")){
                        this.context.fillStyle = "rgba(255,0,0,.5)"
                        this.context.fillRect((cIndex * 22)+1, (rIndex * 22)+1, 20, 20)
                    }
                }
            })
        })
    }


}