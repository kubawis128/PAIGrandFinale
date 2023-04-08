import { WGM } from "../windowManager/WGM/WGM.js"
export class MusicPlayerWGM {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.assetManager = assetManager
        this.WGM = new WGM(this.assetManager.assets.musicPlayer.layout,this.canvas)
        this.audioCtx = new AudioContext()
        this.playing = false
        this.gainNode = this.audioCtx.createGain()
        this.playSound = this.audioCtx.createBufferSource()
        this.currentTime = 0

        // https://stackoverflow.com/questions/3488591/how-to-kick-ass-pass-scope-through-setinterval
        setInterval(this.update.bind(this),1000)
    }

    draw(){
        let duration = this.WGM.rootElements[0].elements[1].elements[0].elements[1] // TODO: Change this to something like getElementByID
        let volume = this.WGM.rootElements[0].elements[1].elements[1].elements[0].position
        let progress = this.WGM.rootElements[0].elements[1].elements[0].elements[2]
        if(this.playSound.buffer){
            duration.content = new Date(this.currentTime * 1000).toISOString().slice(11, 19) + " / " + new Date(this.playSound.buffer.duration * 1000).toISOString().slice(11, 19)
            this.gainNode.gain.value = volume / 100
            progress.position = (this.currentTime / this.playSound.buffer.duration) * 100
        }

        let playButton = this.WGM.rootElements[0].elements[1].elements[0].elements[3].elements[1]
        playButton.content = (this.playing ? "pause" : "play_arrow")
        this.WGM.draw()
    }

    destroy(){
        console.log("Bye From Musish")
    }

    update(){
        if(this.playing){
            this.currentTime += 1
        }
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
            if(element.id == "progress"){
                await this.playSound.stop(0)
                await this.init()
                this.currentTime = this.playSound.buffer.duration * (element.position / 100)
                await this.playSound.start(this.audioCtx.currentTime,this.playSound.buffer.duration * (element.position / 100))
            }
        })
    }

    async play(){
        if(!this.playSound.buffer){
            await this.init()
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

    async init(){
        this.currentTime = 0
        this.gainNode = this.audioCtx.createGain()
        this.playSound = this.audioCtx.createBufferSource()
        this.decodedAudio = await this.audioCtx.decodeAudioData(this.assetManager.assets.musicPlayer.glamourAudio.slice())
        // eslint-disable-next-line no-case-declarations
        this.playSound.buffer = this.decodedAudio
        this.playSound.connect(this.gainNode)
        this.gainNode.connect(this.audioCtx.destination)
    }
}