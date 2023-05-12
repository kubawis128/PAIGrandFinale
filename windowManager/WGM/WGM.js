import {Elements} from "./ElementType.js"

export class WGM {
    
    constructor(guiResourceFile,canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")

        this.layout = JSON.parse(guiResourceFile)

        this.contexts = []
        console.log(this.layout)
        for(var key in this.layout.contexts){
            let currentElement = this.layout.contexts[key]
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
            this.contexts.push(element)
        }
        this.selectedContext = 0
        console.log(this.contexts)
    }

    draw() {
        this.ctx.fillStyle = this.layout.background
        this.ctx.fillRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight)
        
        this.contexts[this.selectedContext].draw(this.ctx)
    }

    destoryEvent(){
        this.contexts.forEach(element => {
            element.destoryEvent()
        })
    }

    handleClick(x,y){
        let clickTree = []
        this.contexts[this.selectedContext].checkCollision(clickTree,x,y)
        return clickTree
    }

    getByID(id){
        for(var key in this.contexts){
            let currentElement = this.contexts[key]
            if (currentElement.id == id){
                return currentElement
            }
            if(currentElement.isEnumerable) {
                let testId = currentElement.getByID(id)
                if(testId){
                    return testId
                }
            }
        }
    }

    handleResize(){
        this.contexts.forEach(element => {
            element.handleResize()
        })
    }

    selectContextByID(id){
        let i = 0
        for(var key in this.contexts){
            let currentElement = this.contexts[key]
            if (currentElement.id == id){
                this.selectedContext = i
                return
            }
            i += 1 
        }
    }
}