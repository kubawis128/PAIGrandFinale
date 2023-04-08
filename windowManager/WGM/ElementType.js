export class Element {
    width
    height
    type
    isEnumerable = false
    id = ""
    y = 0
    x = 0
    xOffset = 0
    padding = 0
    rounded = 0
    constructor(width,height,type,ctx){
        this.ctx = ctx
        this.width = width
        this.height = height
        this.type = type
    }

    updatePlaceHolders(){
        if(typeof(this.width) == "string" && !this.width.includes("parent")){
            this.width = eval(replacePlaceholders(this.ctx, this.width))
        }
        if(typeof(this.xOffset) == "string" && !this.xOffset.includes("parent")){
            this.xOffset = eval(replacePlaceholders(this.ctx, this.xOffset))
        }
        if(typeof(this.height) == "string" &&  !this.height.includes("parent")){
            this.height = eval(replacePlaceholders(this.ctx, this.height))
        }
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

    checkCollision(clickTree,x,y){
        if(x > this.x && x < this.x + this.getWidth()){
            if(y > this.y && y < this.y + this.getHeight()){
                clickTree.push(this)
            }
        }
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

                
                let currentElement = element.elements[childElement]
                let element1 = new Elements[Object.keys(currentElement)[0]]
                element1.ctx = this.ctx
                
                for(var elementKeys in currentElement[Object.keys(currentElement)[0]]){
                    element1[elementKeys] = currentElement[Object.keys(currentElement)[0]][elementKeys]
                }
                if(element1.isEnumerable){
                    element.parseChildren(element1)
                }
                element1.parent = element
                if(element1.afterInit){
                    element1.afterInit()
                }
                element1.updatePlaceHolders()
                
                newList.push(element1)
            }

            element.elements = newList
        }
    }

    checkCollision(clickTree,x,y){
        if(this.elements){
            for(var childElement in this.elements){
                this.elements[childElement].checkCollision(clickTree,x,y)
            }
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
        let lasty = this.y
        let lastX = this.x 
        this.elements.forEach(child => {
            child.x = lastX + child.xOffset
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
        this.height = highestElement
        return highestElement
    }

    getWidth(){
        let totalWidth = 0
        this.elements.forEach(child => {
            totalWidth += child.getWidth()
        })
        return totalWidth
    }

    draw(ctx){
        let lastx = (ctx.canvas.clientWidth - this.getWidth()) /2
        if(isNaN(lastx)){
            lastx = 0
        }
        this.elements.forEach(child => {
            child.y = this.y
            child.x = lastx + child.xOffset
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
        //.warn("Image after init")
        this.imageFile = document.createElement("img")
        this.imageFile.src = "/assets/" + this.src
        this.imageFile.onload = (loaded) => {
            let loaded_img = loaded.target
            loaded_img.width = loaded_img.naturalWidth
            loaded_img.height = loaded_img.naturalHeight
        }
    }

    draw(ctx){
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
        case "centerScreen":
            ctx.fillText(this.content, (ctx.canvas.clientWidth - (ctx.measureText(this.content).width))/2,this.y + this.fontSize)
            break
        case "rightAlign":
            ctx.fillText(this.content, (ctx.canvas.clientWidth - (ctx.measureText(this.content).width)),this.y + this.fontSize)
            break
        default:
            ctx.fillText(this.content, this.x - (ctx.measureText(this.content).width)/4 ,this.y + this.fontSize)
        }
        
    }

    getWidth(){
        return this.ctx.measureText(this.content).width
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
        if(this.backgroundColor){
            ctx.fillStyle = this.backgroundColor
        }else{
            ctx.fillStyle = "#ffffff"
        }

        ctx.beginPath()
        ctx.roundRect(this.x + (this.padding/2),this.y ,this.ctx.measureText(this.content).width + this.innerPadding ,this.fontSize + this.innerPadding ,this.rounded)
        ctx.fill()

        if(this.color){
            ctx.fillStyle = this.color
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

export class Slider extends Element {
    height = 0
    position = 100
    constructor(width,height,ctx){
        super(width,height,"Slider",ctx)
    }

    draw(ctx){
        if(this.color){
            ctx.fillStyle = this.color
        }else{
            ctx.fillStyle = "#ffffff"
        }

        ctx.beginPath()
        ctx.roundRect(this.x,this.y, this.width, this.height,this.rounded)
        ctx.fill()

        if(this.backgroundColor){
            ctx.fillStyle = this.backgroundColor
        }else{
            ctx.fillStyle = "#ffffff"
        }

        ctx.beginPath()
        if(this.sliderType == "vertical"){
            ctx.roundRect(this.x,this.y - this.height * this.position / 100 + this.height, this.width, this.height * this.position / 100,this.rounded)
        }else if(this.sliderType == "horizontal"){
            ctx.roundRect(this.x ,this.y, this.width * this.position / 100, this.height,this.rounded)
        }
        ctx.fill()
    }

    getHeight(){
        return this.height + this.padding
    }

    getWidth(){
        return this.width + this.padding
    }

    checkCollision(clickTree,x,y){
        if(x > this.x && x < this.x + this.getWidth()){
            if(y > this.y && y < this.y + this.getHeight()){
                if(this.sliderType == "vertical"){
                    this.position = ((this.getHeight() - (y - this.y))/this.getHeight())*100
                }else if(this.sliderType == "horizontal"){
                    this.position = (x - this.x)/this.getWidth()*100
                }
                clickTree.push(this)
            }
        }
    }
}

function replacePlaceholders(ctx,string) {
    if(!string){
        return
    }
    string = string.replaceAll("{fullW}",ctx.canvas.clientWidth)
    string = string.replaceAll("{fullH}",ctx.canvas.clientHeight)
    return string
}

const Elements = {
    "List": List,
    "Image": Image,
    "Text": Text,
    "Grid": Grid,
    "Button": Button,
    "Slider": Slider,
}
export { Elements }