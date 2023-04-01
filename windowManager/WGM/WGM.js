import {Elements} from "./ElementType.js"

export class WGM {
    
    constructor(guiResourceFile) {
        this.layout = JSON.parse(guiResourceFile)
        let rootElements = []
        for(var key in this.layout.elements){
            let currentElement = this.layout.elements[key]
            let element = new Elements[key]
            for(var elementKeys in currentElement){
                element[elementKeys] = currentElement[elementKeys]
                if(element.isEnumerable){
                    console.log("Children owns children")
                    element.parseChildren(element)
                }
            }
            rootElements.push(element)
        }
        console.log(rootElements)
        rootElements.forEach(element => {
            element.draw()
        })
    }

    draw(canvas) {
        console.log(this.layout.elements)
    }

}