export class Piece{
    static straight = new Piece("xxxx", "#00f0f0")
    static reverseL = new Piece("x---nxxx", "#0000f0")
    static rightL = new Piece("--xnxxx", "#f0a000")
    static square = new Piece("-xxn-xx", "#f0f000")
    static reverseSqew = new Piece("-xxnxx-", "#00f000")
    static logo = new Piece("-x-nxxx", "#a000f0")
    static squiggly = new Piece("xx-n-xx", "#f00000")

    constructor(points,color){
        this.points = points
        this.color = color
    }
    
    collisions(){
        let tempGrid = [
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""],
            ["","","","","",""]]

        let xOffset = 1
        let yOffset = 1

        this.points.split('').forEach((element) => {
            if(element == "n"){
                yOffset = 1
                xOffset += 1
            }else{
                if(element == "x"){
                    tempGrid[yOffset][xOffset] = "X"

                    if(tempGrid[yOffset-1][xOffset] != "X"){
                        tempGrid[yOffset-1][xOffset] += "U"
                    }
                    if(tempGrid[yOffset+1][xOffset] != "X"){
                        tempGrid[yOffset+1][xOffset] += "D"
                    }
                    if(tempGrid[yOffset][xOffset-1] != "X"){
                        tempGrid[yOffset][xOffset-1] += "L"
                    }

                    if(tempGrid[yOffset][xOffset+1] != "X"){
                        tempGrid[yOffset][xOffset+1] += "R"
                    }

                    yOffset += 1
                }else if(element == "-"){
                    yOffset += 1
                }
            }
        })

        return tempGrid
    }
    
    clone(){
        let piece = new Piece()
        piece.points = structuredClone(this.points)
        piece.color = structuredClone(this.color)
        return piece
    }
}