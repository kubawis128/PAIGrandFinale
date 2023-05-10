import { WGM } from "../../windowManager/WGM/WGM.js"
export class CalcWGM {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.assetManager = assetManager

        this.WGM = new WGM(this.assetManager.assets.Layouts.calculator,this.canvas)
    }

    draw(){
        this.WGM.draw()
    }

    destroy(){
        console.log("Bye From calc")
    }
}