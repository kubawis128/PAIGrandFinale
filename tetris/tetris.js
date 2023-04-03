import {Piece} from "./piece.js"
import {Renderer} from "./renderer.js"
import {playingPiece} from "./playingPiece.js"
import {Grid} from "./grid.js"
//import {Debug} from "./debug.js"

const state = {
    Menu: "Menu",
    Pause: "Pause",
    Loop: "Loop",
    GameOver: "GameOver"
}

export class Game {

    constructor(canvas){
        this.score = 0
        this.olderPiece = null
        this.nextPieces = []
        this.state = state.Loop

        this.grid = new Grid()
        this.rend = new Renderer(canvas)
        //this.debug = new Debug(document.getElementById("debugCanvas"))
        
        document.addEventListener("keydown", (e) => {
            if(this.state != state.Loop){
                return
            }
            switch(e.key){
            case "a":
                if(!this.checkCollisionsMove().includes("L")){
                    this.playingPiece.x -= 1
                    this.update()
                }
                this.update()
                break
            case "d":
                if(!this.checkCollisionsMove().includes("R")){
                    this.playingPiece.x += 1
                    this.update()
                }
                break
            case "e":
                this.playingPiece.rotateClock()
                this.update()
                break
            case "q":
                this.playingPiece.rotateClock()
                this.playingPiece.rotateClock()
                this.playingPiece.rotateClock()
                this.update()
                break
            case " ":
                this.gravity()
                break
            }
        })

        for(let i = 0; i < 4; i++){
            this.addNextPiece()
        }

        this.playingPiece = new playingPiece(this.nextPieces.pop(),5,-3)
        this.update()
    }

    addNextPiece(){
        let avaliable_pieces = [Piece.straight.clone(), Piece.reverseL.clone(), Piece.rightL.clone(), Piece.square.clone(), Piece.reverseSqew.clone(), Piece.logo.clone(), Piece.squiggly.clone()]
        this.nextPieces.push(avaliable_pieces[Math.floor(Math.random()*avaliable_pieces.length)])
    }

    checkGameOver(){
        let collide = false
        this.playingPiece.piece.collisions().forEach(row => {
            row.forEach(col => {
                if(col != null){
                    if(this.grid.get_cell(0, this.playingPiece.x) != null){
                        collide = true
                    }
                }
            })
        })
        return collide
    }

    checkCollisions(){
        let collide = false
        this.collisions = []
        this.playingPiece.piece.collisions().forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if(col != null){
                    if(col.includes("D")){
                        if(this.playingPiece.y + rowIndex > 21 || this.grid.get_cell(this.playingPiece.y+rowIndex-2, this.playingPiece.x+colIndex-1) != null){
                            collide = true
                        }
                    }
                }
            })
        })
        return collide
    }

    checkCollisionsMove(){
        let blocked = []
        this.playingPiece.piece.collisions().forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if(col != null){
                    if(col == "R"){
                        console.log("Right collision")
                        console.log("this.playingPiece.x+colIndex: " + this.playingPiece.x+colIndex)
                        if(this.playingPiece.x+colIndex-1 > 9){
                            blocked.push("R")
                        }
                        if(this.grid.get_cell(this.playingPiece.y+rowIndex-1, this.playingPiece.x+colIndex-1)){
                            blocked.push("R")
                        }
                    }else if(col == "L"){
                        if(this.playingPiece.x+colIndex-1 < 0){
                            blocked.push("L")
                        }
                        if(this.grid.get_cell(this.playingPiece.y+rowIndex-1, this.playingPiece.x+colIndex-1)){
                            blocked.push("L")
                        }
                    }
                }
            })
        })
        return blocked
    }
    
    checkLines(){
        let foundLines = []
        this.grid.grid.forEach((line,lineNr) => {
            if(!line.some((a) => a == null)){
                foundLines.push(lineNr)
            }
        })
        return foundLines
    }

    update(){
        if(this.state != state.Loop){
            return
        }
        if(this.checkLines().length != 0){
            switch (this.checkLines().length){
            case 1:
                this.score += 40
                break
            case 2:
                this.score += 100
                break
            case 3:
                this.score += 300
                break
            case 4:
                this.score += 1200
                break
            }
            this.checkLines().forEach((line) => {
                this.grid.grid.splice(line,1)
                let emptyRow = []
        
                for(let x = 0; x < 10; x++){
                    emptyRow.push(null)
                }
                this.grid.grid.unshift(emptyRow)
            })
        }
        if(this.checkCollisions()){
            this.playingPiece = new playingPiece(this.nextPieces.shift(),5,-3)
            this.addNextPiece()
            this.grid = this.olderPiece
            if(this.grid.get_cell(0, 5) != null || this.grid.get_cell(0, 6) != null){
                this.state = state.GameOver
                console.log("over")
                this.rend.drawGameOver()
            }
            if(this.checkGameOver()){
                this.state = state.GameOver
                this.rend.drawGameOver()
            }
            this.collide = false
            return
        }else{
            let old_grid = this.grid.clone()
            this.grid.set_cell(this.playingPiece.y, this.playingPiece.x, this.playingPiece.piece)
            this.rend.drawGrid(this.grid)
            this.rend.drawNext(this.nextPieces)
            this.olderPiece = this.grid
            this.grid = old_grid
        }
        //this.debug.clear()
        //this.debug.drawCollisionDebug(this.playingPiece.piece)
        this.rend.drawScore(this.score)
    }
    
    gravity(){
        this.playingPiece.y += 1
        this.update()
    }
}