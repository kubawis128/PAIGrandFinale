export class playingPiece {
    constructor(piece, x, y){
        this.piece = piece
        this.x = x
        this.y = y
    }
    rotateClock(){
        let tempGrid = [
            ["","","",""],
            ["","","",""],
            ["","","",""],
            ["","","",""]]

        let xOffset = 0
        let yOffset = 0

        this.piece.points.split("").forEach((element) => {
            if(element == "n"){
                yOffset = 0
                xOffset += 1
            }else{
                if(element == "x"){
                    tempGrid[yOffset][xOffset] = "X"
                    yOffset += 1
                }else if(element == "-"){
                    yOffset += 1
                }
            }
        })

        let tmpString = ""
        tempGrid.forEach((row) => {
            row.forEach(col => {
                if(col != ""){
                    tmpString += col
                }else {
                    tmpString += "-"
                }
            })
            tmpString += "\n"
        })
        
        let rotated = [
            ["","","",""],
            ["","","",""],
            ["","","",""],
            ["","","",""]]
        tempGrid.reverse().forEach((row,rowIndex) => {
            row.forEach((col,colIndex)=> {
                rotated[rowIndex][colIndex] = col
            })
            //tmpString += "\n"
        })
        tmpString = ""
        rotated.forEach((row) => {
            let line = ""
            row.forEach(col => {
                if(col != ""){
                    line += "x"
                }else {
                    line += "-"
                }
            })
            if(line != "----"){
                tmpString += line + "n"
            }
        })
        this.piece.points = tmpString
    }
}