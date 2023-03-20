export class Renderer{
    constructor(canvas){
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
        this.window_list = []

        try {
            this.ctx.beginPath()
            this.ctx.roundRect(0,0,0,0,4)
            this.ctx.fill()
            this.supportsRounded = true
            console.log("The browser does support drawing rounded windows")
        }catch (error){
            this.supportsRounded = false
            console.log("The browser does not support drawing rounded windows")
        }
        
    }

    fillScreen(color){
        this.ctx.fillStyle = color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    addWindow(window){
        //! Here add canvas to the body
        this.window_list.push(window)
    }

    updateWindows(){
        // Call an update on them
        this.window_list.forEach(window => {

            if(this.supportsRounded){
                window.drawRounded()
            }else{
                window.draw()
            }
        })
    }

    getClickedWindow(x,y){
        let found = false
        this.window_list.forEach(window => {
            if(window.x <= x && window.x + window.width >= x){
                if(window.y <= y && window.y + 88 >= y){
                    if(window.x+window.width-30 <= x && window.x + window.width - 2 >= x){
                        found = {window: window, action: "close"}
                        return
                    }
                    if(window.x+window.width-60 <= x && window.x + window.width - 32 >= x){
                        found = {window: window, action: "minimize"}
                        return
                    }
                    found = {window: window, action: "drag"}
                    return
                }
                if(window.y + window.height <= y && window.y + window.height + 8 >= y - 30){
                    found = {window: window, action: "scale", corner: "bottom"}
                    return
                }
            }
        })
        if(found != false){
            return found
        }
        return null
    }

    closeWindow(window){
        //! Here remove canvas from the body
        window.destroy()
        let last = this.window_list
        let index = last.indexOf(window)
        if (index > -1) { // only splice array when item is found
            last.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
}