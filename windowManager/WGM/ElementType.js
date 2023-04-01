export class Element {
    width
    height
    type
    isEnumerable = false
    constructor(width,height,type){
        this.width = width
        this.height = height
        this.type = type
    }
}
class Enumerable extends Element {
    constructor(width,height,type){
        super(width,height,type)
        this.isEnumerable = true
    }

    parseChildren(element){
        let newList = []

        if(element.elements){
            for(var childElement in element.elements){
                //console.log("Child: ", element.elements[childElement])
                
                let currentElement = element.elements[childElement]
                let element1 = new Elements[Object.keys(currentElement)[0]]
                for(var elementKeys in currentElement[Object.keys(currentElement)[0]]){
                    element1[elementKeys] = currentElement[Object.keys(currentElement)[0]][elementKeys]
                }
                if(element1.isEnumerable){
                    element.parseChildren(element1)
                }
                console.log("new element", element1)
                newList.push(element1)
                //console.log(newList)
            }
            element.elements = newList
        }
    }

    draw(){
        this.elements.forEach(child => {
            child.draw()
        })
    }
}
export class List extends Enumerable {
    constructor(width,height){
        super(width,height,"List")
        this.isEnumerable = true
    }
}

export class Grid extends Enumerable {
    constructor(width,height){
        super(width,height,"Grid")
        this.isEnumerable = true
    }
}

export class Image extends Element {
    constructor(width,height){
        super(width,height,"Image")
    }

    draw(){
        console.log("TODO draw Image")
    }
}

export class Text extends Element {
    constructor(width,height){
        super(width,height,"Text")
    }

    draw(){
        console.log("TODO draw Text")
    }
}

export class Button extends Element {
    constructor(width,height){
        super(width,height,"Button")
    }

    draw(){
        console.log("TODO draw Button")
    }
}

const Elements = {
    "List": List,
    "Image": Image,
    "Text": Text,
    "Grid": Grid,
    "Button": Button,
}
export { Elements };