import { WGM } from "../windowManager/WGM/WGM.js"
export class MusicPlayerWGM {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.assetManager = assetManager
        
        this.list_of_songs_json = JSON.parse(this.assetManager.assets.musicPlayer.songs)
        this.list_of_songs = Object.keys(this.list_of_songs_json)
        this.currentSongNr = 0
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
        let duration = this.WGM.getByID("duration")
        let volume = this.WGM.getByID("volume").position
        let progress = this.WGM.getByID("progress")
        if(this.playSound.buffer){
            duration.content = new Date(this.currentTime * 1000).toISOString().slice(11, 19) + " / " + new Date(this.playSound.buffer.duration * 1000).toISOString().slice(11, 19)
            this.gainNode.gain.value = volume / 100
            progress.position = (this.currentTime / this.playSound.buffer.duration) * 100
        }

        let playButton = this.WGM.getByID("play")
        playButton.content = (this.playing ? "pause" : "play_arrow")
        this.WGM.draw()
    }

    destroy(){
        console.log("Bye From Musish")
        if(this.playing){
            this.playSound.stop(0)
            this.playing = false
        }
    }

    update(){
        if(this.playing){
            if(this.playSound.buffer){
                if(this.playSound.buffer.duration > this.currentTime){
                    this.currentTime += 1
                }
            }
        }
    }

    handleClick(x,y){
        let clickedItems = this.WGM.handleClick(x,y)
        clickedItems.forEach(async element => {
            switch (element.id) {
            case "play":
                await this.play()
                break
            case "progress":
                await this.playSound.stop(0)
                await this.init()
                this.currentTime = this.playSound.buffer.duration * (element.position / 100)
                await this.playSound.start(this.audioCtx.currentTime,this.playSound.buffer.duration * (element.position / 100))
                break
            case "next":
                if(this.currentSongNr + 1 == this.list_of_songs.length){
                    this.currentSongNr = 0
                }else {
                    this.currentSongNr += 1
                }
                if(this.playSound.buffer){
                    await this.playSound.stop(0)
                }
                await this.init()
                await this.playSound.start(0) 
                this.audioCtx.resume()
                this.playing = true
                break
            case "back":
                if(this.currentSongNr == 0){
                    this.currentSongNr = this.list_of_songs.length - 1
                } else {
                    this.currentSongNr -= 1

                }
                if(this.playSound.buffer){
                    await this.playSound.stop(0)
                }
                await this.init()
                await this.playSound.start(0)
                this.audioCtx.resume()
                this.playing = true
                break
            default:
                break
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
        this.decodedAudio = await this.audioCtx.decodeAudioData(this.assetManager.assets.musicPlayer[this.list_of_songs[this.currentSongNr] + "Audio"].slice())
        this.WGM.getByID("cover").src = "musicPlayer/" + this.list_of_songs[this.currentSongNr] + ".png"
        this.WGM.getByID("cover").reloadImg()
        this.WGM.getByID("title").content = this.list_of_songs_json[this.list_of_songs[this.currentSongNr]]
        // eslint-disable-next-line no-case-declarations
        this.playSound.buffer = this.decodedAudio
        this.playSound.connect(this.gainNode)
        this.gainNode.connect(this.audioCtx.destination)
    }
}