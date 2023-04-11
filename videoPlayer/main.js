import { WGM } from "../windowManager/WGM/WGM.js"
export class VideoPlayerWGM {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.assetManager = assetManager

        this.WGM = new WGM(this.assetManager.assets.videoPlayer.layout,this.canvas)
    }

    draw(){
        this.WGM.draw()
    }

    destroy(){
        console.log("Bye From videos")
    }
}