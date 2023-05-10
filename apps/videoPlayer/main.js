import { WGM } from "../../windowManager/WGM/WGM.js"
export class VideoPlayerWGM {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.assetManager = assetManager

        this.WGM = new WGM(this.assetManager.assets.Layouts.videoPlayer,this.canvas)

        this.source = this.WGM.getByID("source")
        this.source.tag.src = "/assets/videoPlayer/test.mp4"
        this.video = this.WGM.getByID("video")
        this.playing = false

        this.video.tag.addEventListener( "loadedmetadata", function (e) {
            console.warn("Height:", e.target.videoHeight)
            this.video.height = e.target.videoHeight
            console.warn("Width:", e.target.videoWidth)
            this.video.width = e.target.videoWidth

            this.window.resize(this.video.width + 20, this.video.height + 100)
            this.canvas.width = this.video.width + 20
            this.canvas.height = this.video.height + 100
            this.WGM.handleResize()
        }.bind(this), false )

        
    }

    draw(){
        let playButton = this.WGM.getByID("play")
        playButton.content = (this.playing ? "pause" : "play_arrow")
        let progress = this.WGM.getByID("progress")
        let duration = this.WGM.getByID("duration")
        if(this.playing){
            duration.content = new Date(this.video.tag.currentTime * 1000).toISOString().slice(11, 19) + " / " + new Date(this.video.tag.duration * 1000).toISOString().slice(11, 19)
            progress.position = (this.video.tag.currentTime / this.video.tag.duration) * 100
        }
        this.WGM.draw()
    }

    handleClick(x,y){
        let clickedItems = this.WGM.handleClick(x,y)
        clickedItems.forEach(async element => {
            switch (element.id) {
            case "play":
                if(!this.playing){
                    this.video.tag.play()
                }else{
                    this.video.tag.pause()
                }
                this.playing = !this.playing 
                break
            case "volume":
                this.video.tag.volume = element.position / 100
                break
            case "progress":
                this.video.tag.currentTime = this.video.tag.duration * (element.position / 100)
                break
            default:
                break
            }
        })
    }

    destroy(){
        this.WGM.destoryEvent()
        console.log("Bye From videos")
    }
}