export class Window{

    constructor(x,y,width,height,title,innerElementTag,rend){
        console.log(innerElementTag)
        this.x = x
        this.y = y

        this.width = width
        this.height = height

        this.uuid = this.generatePseudoRandomUUID()

        this.title = title
        
        this.holdingX = x
        this.holdingY = y


        this.windowCanvas = document.createElement("canvas")
        document.getElementsByTagName("body")[0].appendChild(this.windowCanvas)
        this.windowCanvas.width = width+6
        this.windowCanvas.height = height+34
        this.windowCanvas.style.left = x-6 + "px"
        this.windowCanvas.style.top = y + "px" 
        this.windowCanvas.id = "titlebar"

        this.inner = document.createElement(innerElementTag)
        this.inner.id = this.uuid
        document.getElementsByTagName("body")[0].appendChild(this.inner)
        this.inner.width = width
        this.inner.height = height
        this.inner.style.left = x-3 + "px"
        this.inner.style.top = y+30 + "px" 

        this.renderer = rend

        this.oldx = x
        this.oldy = y
        this.minimized = false

    }
    
    draw(){
        let ctx = this.windowCanvas.getContext("2d")
        // Main window
        ctx.fillStyle = "#414348"
        ctx.fillRect(3, 0, this.width+6, this.height+33)

        // Tile Bar
        ctx.fillStyle = "#696969"
        ctx.fillRect(3, 0, this.width+6, 30)

        // Window Title
        ctx.font = "24px Minecraft"
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(this.title, (this.width/2)-(ctx.measureText(this.title).width/2), 24)

        // Close Button and it's text
        ctx.fillStyle = "#DF2E38"
        ctx.fillRect(this.width-30, 2, 26, 26)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("X", this.width-30+(ctx.measureText("X").width/2), 24)

        // Minimize Button
        ctx.fillStyle = "#3E54AC"
        ctx.fillRect(this.width-60, 2, 26, 26)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("_", this.width-60+(ctx.measureText("_").width/2), 24)
        if(this.instance){
            if(this.instance.draw){
                this.instance.draw()

            }
        }
    }

    drawRounded(){
        let ctx = this.windowCanvas.getContext("2d")
        //console.log("Try to draw rounded windows")
        // Main window
        ctx.fillStyle = "#414348"
        ctx.beginPath()
        ctx.roundRect(0, 0, this.width+6, this.height+33,6)
        ctx.fill()

        // Tile Bar
        ctx.fillStyle = "#696969"
        ctx.beginPath()
        ctx.roundRect(0, 0, this.width+6, 30,[6,6,0,0])
        ctx.fill()

        // Window Title
        ctx.font = "24px Minecraft"
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(this.title, (this.width/2)-(ctx.measureText(this.title).width/2), 24)

        // Close Button and it's text
        ctx.fillStyle = "#DF2E38"
        ctx.beginPath()
        ctx.roundRect(this.width-30, 2, 26, 26,4)
        ctx.fill()
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("X", this.width-30+(ctx.measureText("X").width/2), 24)

        // Minimize Button
        ctx.fillStyle = "#3E54AC"
        ctx.beginPath()
        ctx.roundRect(this.width-60, 2, 26, 26,4)
        ctx.fill()
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText("_", this.width-60+(ctx.measureText("_").width/2), 24)
        if(this.instance){
            if(this.instance.draw){
                this.instance.draw()
            }
        }
    }

    destroy(){
        console.log("destroy called quitting")
        console.log("instance: ",this)
        console.log("instance: ",this.instance)

        if(this.instance){
            this.instance.destroy()
        }
        document.body.removeChild(this.inner)
        document.body.removeChild(this.windowCanvas)
    }

    destroyUI(){
        //document.body.removeChild(this.canvas)
        this.renderer.closeWindow(this)
    }
    
    setHolding(x,y){
        this.holdingX = x
        this.holdingY = y

        this.updatePos()
    }

    generatePseudoRandomUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8)
            return v.toString(16)
        })
    }

    minimize(){
        /* Send the window to brazill (offscreen) */
        this.oldx = this.x
        this.oldy = this.y
        this.x = 3000
        this.y = 3000 
        this.updatePos()

        this.minimized = true
    }

    unminimize(){
        /* Retreive the window from brazill */
        this.x = this.oldx
        this.y = this.oldy 
        this.updatePos()

        this.minimized = false
    }

    switchMinimized(){
        if(this.minimized){
            this.unminimize()
        }else{
            this.minimize()
        }
    }
    updatePos(){
        this.inner.style.left = this.x-3 + "px"
        this.inner.style.top = (this.y-30)+60 + "px" 

        this.windowCanvas.style.left = this.x-6 + "px"
        this.windowCanvas.style.top = this.y + "px" 
    }

    handleClick(x,y){
        if(this.instance && this.instance.handleClick){
            if(x - this.x && y - this.y - 32){
                this.instance.handleClick(x - this.x,y - this.y - 32)
            }
        }
    }

    resize(width,height){
        this.windowCanvas.width = width+6
        this.windowCanvas.height = height+34
        this.width = this.windowCanvas.width
        this.height = this.windowCanvas.height
    }
}