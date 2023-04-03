import { WGM } from "../windowManager/WGM/WGM.js"
export class MusicPlayerWGM {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.assetManager = assetManager
        this.WGM = new WGM(this.assetManager.assets.musicPlayer.layout,this.canvas)
        this.audioCtx = new AudioContext()
        this.playing = false
        this.playSound = this.audioCtx.createBufferSource()
    }

    draw(){
        let duration = this.WGM.rootElements[0].elements[1].elements[0].elements[1] // TODO: Change this to something like getElementByID
        if(this.playSound.buffer){
            duration.content = new Date(this.audioCtx.currentTime * 1000).toISOString().slice(11, 19)
        }
        this.WGM.draw()

    }

    destroy(){
        console.log("Bye From Musish")
    }

    handleClick(x,y){
        let clickedItems = this.WGM.handleClick(x,y)
        clickedItems.forEach(async element => {
            if(element.type == "Button"){
                switch(element.id){
                case "play":
                    await this.play()
                    break
                default:
                    break
                }
            }
        })
    }

    async play(){
        if(!this.playSound.buffer){
            let decodedAudio = await this.audioCtx.decodeAudioData(this.assetManager.assets.musicPlayer.glamourAudio.slice())
            // eslint-disable-next-line no-case-declarations
            this.playSound.buffer = decodedAudio
            this.playSound.connect(this.audioCtx.destination)
            this.playSound.start(this.audioCtx.currentTime)
        }else{
            if(!this.playing){
                this.audioCtx.resume()
            }else{
                this.audioCtx.suspend()
            }
        }
        this.playing = !this.playing
    }
}