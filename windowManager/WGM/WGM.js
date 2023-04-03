import {Elements} from "./ElementType.js"

export class WGM {
    
    constructor(guiResourceFile,canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")

        this.layout = JSON.parse(guiResourceFile)

        this.rootElements = []
        for(var key in this.layout.elements){
            let currentElement = this.layout.elements[key]
            let element = new Elements[key]
            element.ctx = this.ctx
            for(var elementKeys in currentElement){
                element[elementKeys] = currentElement[elementKeys]
                if(element.isEnumerable){
                    //console.log("Children owns children")
                    element.parseChildren(element)
                }
            }
            if(element.afterInit){
                element.afterInit()
            }
            element.updatePlaceHolders()
            this.rootElements.push(element)
        }
        console.log(this.rootElements)
    }

    draw() {
        this.ctx.fillStyle = this.layout.background
        this.ctx.fillRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight)
        this.rootElements.forEach(element => {
            element.draw(this.ctx)
        })
    }

    handleClick(x,y){
        let clickTree = []
        this.rootElements.forEach(element => {
            element.checkCollision(clickTree,x,y)
        })
        return clickTree
    }
}