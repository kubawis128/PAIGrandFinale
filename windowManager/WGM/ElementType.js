export class Element {
    width
    height
    type
    isEnumerable = false
    id = ""
    y = 0
    x = 0
    xOffset = 0
    yOffset = 0
    padding = 0
    rounded = 0
    constructor(width,height,type,ctx){
        this.ctx = ctx
        this.width = width
        this.height = height
        this.type = type
    }

    updatePlaceHolders(){
        if(typeof(this.width) == "string"){
            this.widthPlaceHolder = this.width
            this.width = eval(replacePlaceholders(this.ctx, this.width))
        }
        if(typeof(this.height) == "string"){
            this.heightPlaceHolder = this.height
            this.height = eval(replacePlaceholders(this.ctx, this.height))
        }
        if(typeof(this.xOffset) == "string"){
            this.xOffsetPlaceHolder = this.xOffset
            this.xOffset = eval(replacePlaceholders(this.ctx, this.xOffset))
        }
        if(typeof(this.yOffset) == "string"){
            this.yOffsetPlaceHolder = this.yOffset
            this.yOffset = eval(replacePlaceholders(this.ctx, this.yOffset))
        }

        if(this.x){
            this.xPlaceHolder = this.x
            this.x = eval(replacePlaceholders(this.ctx, this.x))
        }
        if(this.y){
            this.yPlaceHolder = this.y
            this.y = eval(replacePlaceholders(this.ctx, this.y))
        }
    }

    getWidth(){
        return this.width + this.padding
    }

    getHeight(){
        return this.height + this.padding
    }

    checkCollision(clickTree,x,y){
        if(x > this.x + this.xOffset && x < this.x + this.xOffset + this.getWidth()){
            if(y > this.y + this.yOffset && y < this.y + this.yOffset + this.getHeight()){
                clickTree.push(this)
            }
        }
    }

    handleResize(){
        console.warn("resize event")
        if(this.widthPlaceHolder){
            this.width = eval(replacePlaceholders(this.ctx, this.widthPlaceHolder))
        }
        if(this.heightPlaceHolder){
            this.height = eval(replacePlaceholders(this.ctx, this.heightPlaceHolder))
        }
        if(this.xOffsetPlaceHolder){
            this.xOffset = eval(replacePlaceholders(this.ctx, this.xOffsetPlaceHolder))
        }
        if(this.yOffsetPlaceHolder){
            this.yOffset = eval(replacePlaceholders(this.ctx, this.yOffsetPlaceHolder))
        }
        if(this.xPlaceHolder){
            this.x = eval(replacePlaceholders(this.ctx, this.xPlaceHolder))
        }
        if(this.yPlaceHolder){
            this.y = eval(replacePlaceholders(this.ctx, this.yPlaceHolder))
        }
    }

    destoryEvent(){
        console.log("destroy", this.type)
        // Empty
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
                console.warn(currentElement)
                let element1 = new Elements[Object.keys(currentElement)[0]]
                element1.ctx = this.ctx
                
                for(var elementKeys in currentElement[Object.keys(currentElement)[0]]){
                    element1[elementKeys] = currentElement[Object.keys(currentElement)[0]][elementKeys]
                }
                if(element1.isEnumerable && element1.type != "HTMLElement"){
                    element.parseChildren(element1)
                }else if (element1.isEnumerable && element1.type == "HTMLElement"){
                    element1.parseChildren(element1)
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

    getByID(id){
        if(this.elements){
            for(var key in this.elements){
                let currentElement = this.elements[key]
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
    }

    handleResize(){
        console.warn("resize event")
        for(var key in this.elements){
            let currentElement = this.elements[key]
            if(currentElement.widthPlaceHolder){
                currentElement.width = eval(replacePlaceholders(currentElement.ctx, currentElement.widthPlaceHolder))
            }
            if(currentElement.heightPlaceHolder){
                currentElement.height = eval(replacePlaceholders(currentElement.ctx, currentElement.heightPlaceHolder))
            }
            if(currentElement.xOffsetPlaceHolder){
                currentElement.xOffset = eval(replacePlaceholders(currentElement.ctx, currentElement.xOffsetPlaceHolder))
            }
            if(currentElement.yOffsetPlaceHolder){
                currentElement.yOffset = eval(replacePlaceholders(currentElement.ctx, currentElement.yOffsetPlaceHolder))
            }
            if(currentElement.xPlaceHolder){
                currentElement.x = eval(replacePlaceholders(currentElement.ctx, currentElement.xPlaceHolder))
            }
            if(currentElement.yPlaceHolder){
                currentElement.y = eval(replacePlaceholders(currentElement.ctx, currentElement.yPlaceHolder))
            }
            if(currentElement.isEnumerable) {
                currentElement.handleResize()
            }
        }
    }

    destoryEvent(){
        if(this.elements){
            for(var childElement in this.elements){
                this.elements[childElement].destoryEvent()
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
        })
        return totalHeight
    }

    draw(ctx){
        let lasty = this.y + this.padding / 2 + this.yOffset
        this.elements.forEach(child => {
            child.x = this.x + this.padding / 2 + this.xOffset
            child.y = lasty
            child.draw(ctx)
            lasty = child.y + child.getHeight()
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
        let lastx = 0
        if(this.align && this.align == "center"){
            lastx = (ctx.canvas.clientWidth - this.getWidth()) /2
        }
        if(isNaN(lastx)){
            lastx = this.x + this.padding / 2 + this.xOffset
        }
        this.elements.forEach(child => {
            child.y = this.y + this.padding / 2 + this.yOffset
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
        this.reloadImg()
    }

    reloadImg(){
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
        ctx.roundRect(this.x + this.padding/2 + this.xOffset ,this.y + this.padding/2 + this.yOffset,this.width,this.height,this.rounded) 
        ctx.closePath()
        ctx.save()
        ctx.clip()
        ctx.drawImage(this.imageFile ,this.x + this.padding/2 + this.xOffset,this.y + this.padding/2 + this.yOffset,this.width,this.height)
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
            ctx.fillText(this.content, (ctx.canvas.clientWidth - (ctx.measureText(this.content).width))/2  + this.padding/2 + this.xOffset, this.y + this.fontSize + this.padding/2 + this.yOffset)
            break
        case "rightAlign":
            ctx.fillText(this.content, (ctx.canvas.clientWidth - (ctx.measureText(this.content).width)) + this.padding/2 + this.xOffset, this.y + this.fontSize + this.padding/2 + this.yOffset)
            break
        default:
            ctx.fillText(this.content, this.x + this.padding/2  + this.xOffset ,this.y + this.fontSize + this.padding/2 + this.yOffset)
        }
        
    }

    getWidth(){
        return this.ctx.measureText(this.content).width + this.padding
    }

    getHeight(){
        return this.fontSize + this.padding
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
        ctx.roundRect(
            this.x + (this.padding/2) + this.xOffset,
            this.y + (this.padding/2) + this.yOffset,
            this.measuredTextWidth + this.innerPadding,
            this.fontSize + this.innerPadding,
            this.rounded)
        ctx.fill()
        if(this.color){
            ctx.fillStyle = this.color
        }else{
            ctx.fillStyle = "#000000"
        }
        ctx.font = this.font
        ctx.fillText(this.content,this.x + (this.padding/2) + (this.innerPadding/2) + this.xOffset,this.y + this.fontSize + (this.innerPadding/2) + this.yOffset)
    }

    afterInit() {
        let regexp = /(\d+)(?=\s*px)/
        this.fontSize = parseInt(regexp.exec(this.font)[0])
    }

    getHeight(){
        return this.fontSize + this.padding + this.innerPadding 
    }

    getWidth(){
        this.ctx.font = this.font
        this.measuredTextWidth = this.ctx.measureText(this.content).width
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
        if(this.backgroundColor){
            ctx.fillStyle = this.backgroundColor
        }else{
            ctx.fillStyle = "#cccccc"
        }

        ctx.beginPath()
        ctx.roundRect(this.x + this.padding/2 + this.xOffset,this.y + this.padding/2 + this.yOffset, this.width, this.height,this.rounded)
        ctx.fill()

        if(this.color){
            ctx.fillStyle = this.color
        }else{
            ctx.fillStyle = "#ffffff"
        }

        ctx.beginPath()
        if(this.sliderType == "vertical"){
            ctx.roundRect(this.x + this.padding/2 + this.xOffset ,(this.y + this.yOffset) - (this.height * this.position / 100) + this.height + this.padding/2, this.width, this.height * this.position / 100,this.rounded)
        }else if(this.sliderType == "horizontal"){
            ctx.roundRect(this.x + this.padding/2 + this.xOffset ,this.y + this.padding/2 + this.yOffset, this.width * this.position / 100, this.height,this.rounded)
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
        if(x > this.x + this.xOffset && x < this.x + this.xOffset + this.getWidth()){
            if(y > this.y + this.yOffset && y < this.y + this.yOffset + this.getHeight()){
                if(this.sliderType == "vertical"){
                    this.position = ((this.getHeight() - (y - this.y + this.yOffset))/this.getHeight())*100
                }else if(this.sliderType == "horizontal"){
                    this.position = (x - (this.x + this.xOffset))/this.getWidth()*100
                }
                clickTree.push(this)
            }
        }
    }
}

export class HTMLElement extends Enumerable {
    HTMLtag = ""
    constructor(width,height,ctx){
        super(width,height,"HTMLElement",ctx)
        this.isEnumerable = true
    }

    afterInit(){
        this.tag = document.createElement(this.HTMLtag)
        this.tag.style.position = "absolute"
        console.warn(this.x + (this.padding / 2) + parseInt(this.ctx.canvas.style.left) + "px")
        this.tag.style.left = this.x + (this.padding / 2) + this.xOffset + parseInt(this.ctx.canvas.style.left) + "px"
        this.tag.style.top = this.y + (this.padding / 2) + this.yOffset + parseInt(this.ctx.canvas.style.top) + "px"
        this.tag.style.width = this.width + "px"
        this.tag.style.height = this.height + "px"
        this.tag.id = this.ctx.canvas.id // quick fix for crash when clicking html element without a window UUID
        console.warn(this.parent)
        for(let child in this.elements){
            console.warn("dziecek")
            if(this.elements[child].afterInit){
                this.elements[child].afterInit()
            }
            if(this.elements[child].type == "HTMLElement"){
                this.tag.appendChild(this.elements[child].tag)
            }
        }
        if(this.parent.type != "HTMLElement"){
            document.body.appendChild(this.tag)
        }        
    }

    // eslint-disable-next-line no-unused-vars
    draw(_ctx){
        this.tag.style.left = this.x + (this.padding / 2) + this.xOffset + parseInt(this.ctx.canvas.style.left) + "px"
        this.tag.style.top = this.y + (this.padding / 2) + this.yOffset + parseInt(this.ctx.canvas.style.top) + "px"
        this.tag.style.width = this.width + "px"
        this.tag.style.height = this.height + "px"
        // Browser handles the rest
    }

    getHeight(){
        return this.height + this.padding
    }

    getWidth(){
        return this.width + this.padding
    }

    getByID(id){
        if(this.elements){
            for(var key in this.elements){
                let currentElement = this.elements[key]
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
    }

    destoryEvent(){
        if(this.parent.type == "HTMLElement"){
            this.parent.tag.removeChild(this.tag)
        }else{
            document.body.removeChild(this.tag)
        }
    }
}

export class DebugSquare extends Element {
    constructor(width,height,ctx){
        super(width,height,"DebugSquare",ctx)
    }

    afterInit(){

    }

    // eslint-disable-next-line no-unused-vars
    draw(ctx){
        if(this.color){
            ctx.fillStyle = this.color
        }
        ctx.beginPath()
        ctx.roundRect(this.x + (this.padding/2) + this.xOffset,
            this.y + (this.padding/2) + this.yOffset,
            this.width,
            this.height,
            this.rounded)
        ctx.fill()
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
    "HTMLElement": HTMLElement,
    "DebugSquare": DebugSquare,
}

export { Elements }
