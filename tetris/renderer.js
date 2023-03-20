export class Renderer {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
    }
    
    drawGrid(grid){
        this.ctx.fillStyle = "#313338"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = "#414348"
        grid.get_whole_grid().forEach((row,indexRow) => {
            row.forEach((col, indexCol) => {
                if(grid.get_cell(indexRow,indexCol)){
                    this.ctx.fillStyle = grid.get_cell(indexRow,indexCol).color
                }else{
                    this.ctx.fillStyle = "#414348"
                }5==3
                this.ctx.fillRect((indexCol * 22)+1, (indexRow * 22)+1, 20, 20)
            })
        }); 
    }

    drawNext(pieces){
        pieces.forEach((piece, pieceIndex) => {
            let tempGrid = [[null,null],[null,null],[null,null],[null,null]] // TODO: Stupid Change Me later 
            let xOffset = 0
            let yOffset = 0
            piece.points.split('').forEach((element) => {
                if(element == "n"){
                    yOffset = 0
                    xOffset += 1
                }else{
                    if(element == "x"){
                        tempGrid[yOffset][xOffset] = piece
                        yOffset += 1
                    }else if(element == "-"){
                        yOffset += 1
                    }
                }
            })
            tempGrid.forEach((row,indexRow) => {
                row.forEach((col, indexCol) => {
                    if(tempGrid[indexRow][indexCol]){
                        this.ctx.fillStyle = tempGrid[indexRow][indexCol].color
                    }else{
                        this.ctx.fillStyle = "#313338"
                    }
                    this.ctx.fillRect((indexCol * 22)+240, (indexRow * 22)+100+(pieceIndex*100), 20, 20)
                })
            });
        })
    }
    
    drawScore(score){
        this.ctx.font = "24px serif";
        this.ctx.fillStyle = "#FFFFFF"
        this.ctx.fillText("Score:\n", 225, 30);
        this.ctx.fillText(score, 225, 60);
    }

    drawGameOver(){
        this.ctx.fillStyle = "#F0000060"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.font = "48px serif";
        this.ctx.fillStyle = "#FFFFFF"
        let textSize = this.ctx.measureText("Game Over")
        this.ctx.fillText("Game Over", (this.canvas.width/2)-textSize.width/2, this.canvas.height/2);
    }
}