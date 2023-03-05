export class Renderer{
    constructor(canvas){
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
        this.window_list = []
    }

    fillScreen(color){
        this.ctx.fillStyle = color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    
    addWindow(window){
        this.window_list.push(window)
    }

    updateWindows(){
        this.window_list.forEach(window => {
            window.draw(this.ctx)
        })
    }

    getClickedWindow(x,y){
        let found = false
        this.window_list.forEach(window => {
            if(window.x <= x && window.x + window.width >= x){
                if(window.y <= y && window.y + 88 >= y){
                    if(window.x+window.width-30 <= x && window.x + window.width - 2 >= x){
                        found = {window: window, action: "close"}
                        return {window: window, action: "close"}
                    }
                    found = {window: window, action: "Titlebar"}
                    return {window: window, action: "Titlebar"}
                }
            }
        })
        if(found != false){
            return found
        }
        return null
    }
    closeWindow(window){
        this.window_list.pop(window)
        window.destroy()
    }
}