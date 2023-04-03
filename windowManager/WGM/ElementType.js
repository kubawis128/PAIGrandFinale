export class Element {
    width = 0
    height = 0
    type
    isEnumerable = false
    id = ""
    y = 0
    x = 0
    padding = 0
    rounded = 0
    constructor(width,height,type,ctx){
        this.ctx = ctx
        this.width = width
        this.height = height
        this.type = type
    }

    updatePlaceHolders(){
        this.width = eval(replacePlaceholders(this.ctx, this.width))
        this.height = eval(replacePlaceholders(this.ctx, this.height))
        if(this.x){
            this.x = eval(replacePlaceholders(this.ctx, this.x))
        }
    }

    getWidth(){
        return this.width
    }

    getHeight(){
        return this.height
    }
}
class Enumerable extends Element {
    constructor(width,height,type,ctx){
        super(width,height,type,ctx)
        this.isEnumerable = true
    }

    parseChildren(element){
        let newList = []

        if(element.elements){
            for(var childElement in element.elements){
                //console.log("Child: ", element.elements[childElement])
                
                let currentElement = element.elements[childElement]
                let element1 = new Elements[Object.keys(currentElement)[0]]
                element1.ctx = this.ctx
                for(var elementKeys in currentElement[Object.keys(currentElement)[0]]){
                    element1[elementKeys] = currentElement[Object.keys(currentElement)[0]][elementKeys]
                }
                if(element1.isEnumerable){
                    element.parseChildren(element1)
                }
                if(element1.afterInit){
                    element1.afterInit()
                }
                element1.updatePlaceHolders()
                newList.push(element1)
            }
            element.elements = newList
        }
    }

}
export class List extends Enumerable {
    constructor(width,height,ctx){
        super(width,height,"List",ctx)
        this.isEnumerable = true
    }

    getHeight(){
        let totalHeight = 0
        this.elements.forEach(child => {
            totalHeight += child.getHeight()
            totalHeight += child.padding
        })
        return totalHeight
    }

    draw(ctx){
        let lasty = 0
        this.elements.forEach(child => {
            child.y = lasty
            child.y += child.padding / 2
            child.draw(ctx)
            lasty = child.y + child.getHeight()
            lasty += child.padding / 2
        })
    }
}

export class Grid extends Enumerable {
    constructor(width,height,ctx){
        super(width,height,"Grid",ctx)
        this.isEnumerable = true
    }

    getHeight(){
        let highestElement = 0
        this.elements.forEach(child => {
            if(highestElement < child.getHeight()){
                highestElement = child.getHeight()
            }
        })
        return highestElement
    }

    getWidth(){
        let totalWidth = 0
        this.elements.forEach(child => {
            totalWidth += child.getWidth()
        })
        console.log("Get this grid width ",totalWidth)
        return totalWidth
    }

    draw(ctx){
        console.log(ctx.canvas.clientWidth)
        let lastx = (ctx.canvas.clientWidth - this.getWidth()) /2
        this.elements.forEach(child => {
            child.y = this.y
            child.x = lastx
            child.draw(ctx)
            lastx = lastx + child.getWidth()
        })
    }
}

export class Image extends Element {
    constructor(width,height,ctx){
        super(width,height,"Image",ctx)
    }

    afterInit(){
        console.warn("Image after init")
        this.imageFile = document.createElement("img")
        this.imageFile.src = "/assets/" + this.src
        this.imageFile.onload = (loaded) => {
            let loaded_img = loaded.target
            loaded_img.width = loaded_img.naturalWidth
            loaded_img.height = loaded_img.naturalHeight
        }
    }

    draw(ctx){
        console.log(this.imageFile)
        ctx.beginPath()
        ctx.roundRect(this.x,this.y,this.width,this.height,this.rounded) 
        ctx.closePath()
        ctx.save()
        ctx.clip()
        ctx.drawImage(this.imageFile ,this.x,this.y,this.width,this.height)
        ctx.restore()
    }
}

export class Text extends Element {
    constructor(width,height,ctx){
        super(width,height,"Text",ctx)
    }

    afterInit() {
        let regexp = /(\d+)(?=\s*px)/
        this.fontSize = parseInt(regexp.exec(this.font)[0])
    }

    draw(ctx){
        ctx.font = this.font
        if(this.color){
            ctx.fillStyle = this.color
        }else{
            ctx.fillStyle = "#ffffff"
        }
        switch (this.align) {
        case "center":
            console.log("Centered text")
            ctx.fillText(this.content, (ctx.canvas.clientWidth - (ctx.measureText(this.content).width))/2,this.y + this.fontSize)
            break
        case "rightAlign":
            console.log("Centered text")
            ctx.fillText(this.content, (ctx.canvas.clientWidth - (ctx.measureText(this.content).width)),this.y + this.fontSize)
            break
        default:
            ctx.fillText(this.content, this.x,this.y + this.fontSize)
        }
        
    }

    getHeight(){
        return this.fontSize
    }
}

export class Button extends Element {
    innerPadding = 0
    constructor(width,height,ctx){
        super(width,height,"Button",ctx)
    }

    draw(ctx){
        if(this.color){
            ctx.fillStyle = this.color
        }else{
            ctx.fillStyle = "#ffffff"
        }

        ctx.beginPath()
        ctx.roundRect(this.x + (this.padding/2),this.y ,this.ctx.measureText(this.content).width + this.innerPadding ,this.fontSize + this.innerPadding ,this.rounded)
        ctx.fill()

        if(this.fontColor){
            ctx.fillStyle = this.fontColor
        }else{
            ctx.fillStyle = "#000000"
        }
        ctx.font = this.font
        ctx.fillText(this.content,this.x + (this.padding/2) + (this.innerPadding/2) ,this.y + this.fontSize + (this.innerPadding /2 ))
    }

    afterInit() {
        let regexp = /(\d+)(?=\s*px)/
        this.fontSize = parseInt(regexp.exec(this.font)[0])
    }

    getHeight(){
        return this.fontSize + this.padding + + this.innerPadding 
    }

    getWidth(){
        this.ctx.font = this.font
        return this.ctx.measureText(this.content).width + this.padding + this.innerPadding
    }
}

function replacePlaceholders(ctx,string) {
    if(!string){
        return
    }
    string = string.replace("{fullW}",ctx.canvas.clientWidth)
    string = string.replace("{fullH}",ctx.canvas.clientHeight)
    return string
}

const Elements = {
    "List": List,
    "Image": Image,
    "Text": Text,
    "Grid": Grid,
    "Button": Button,
}
export { Elements }