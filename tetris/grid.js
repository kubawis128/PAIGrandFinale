export class Grid {
    constructor() {
        this.grid = []
        let emptyRow = []
        
        for(let x = 0; x < 10; x++){
            emptyRow.push(null)
        }
        
        for(let y = 0; y < 20; y++){
            this.grid.push(structuredClone(emptyRow))
        }
    }

    get_cell(y, x){
        if(y < 0){
            return null
        }
        return this.grid[y][x]
    }
    
    set_cell(y, x, piece){
        let xOffset = 0
        let yOffset = 0
        
        piece.points.split('').forEach((element) => {
            
            if(element == "n"){
                yOffset = 0
                xOffset += 1
            }else{
                if(element == "x"){
                    if(y+yOffset >= 0){
                     this.grid[y+yOffset][x+xOffset] = piece
                    }
                    yOffset += 1
                }else if(element == "-"){
                    yOffset += 1
                }
            }
        })
    }

    get_whole_grid(){
        return this.grid
    }

    clone(){
        let gridd = new Grid()
        gridd.grid = structuredClone(this.grid)
        return gridd
    }
}