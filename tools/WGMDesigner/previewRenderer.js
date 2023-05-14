import { WGM } from "/windowManager/WGM/WGM.js"

let canvas = document.getElementById("preview")
let canvasTree = document.getElementById("treePreview")
let layout = document.getElementById("inOutLayout")

document.addEventListener("DOMContentLoaded", loaded)
let wgm

function loaded(){
    wgm = new WGM(layout.value,canvas)
    canvas.width = wgm.layout.xSize
    canvas.height = wgm.layout.ySize
    drawTree()
}

layout.addEventListener("input", () => {update(0)})

function update(context){
    wgm = new WGM(layout.value,canvas)
    wgm.draw()
    canvas.width = wgm.layout.xSize
    canvas.height = wgm.layout.ySize

    if(context){
        wgm.selectedContext = context
    }else{
        wgm.selectedContext = 0
    }

    drawTree()
}

let ctx = canvasTree.getContext("2d")
let y = 22
let x = 4

function drawTree(){
    y = 22
    x = 4
    ctx.fillStyle = "#414348"
    ctx.fillRect(0,0,canvasTree.width, canvasTree.height)

    ctx.font = "24px Minecraft"
    ctx.fillStyle = "#ffffff"

    ctx.fillText("Root", x, y)
    
    ctx.font = "16px Minecraft"
    let current_element = wgm.contexts[wgm.selectedContext]
    x += 12
    y += 16
    ctx.fillText(current_element.type, x, y)
    // TODO: Add select context
    if(current_element.isEnumerable){
        drawTreeUndChildren(current_element)
    }
}

function drawTreeUndChildren(current){
    current.elements.forEach(element => {
        y += 16
        ctx.fillStyle = "#ffffff"
        ctx.font = "16px Minecraft"
        ctx.fillText(element.type, x, y)
        let size = ctx.measureText(element.type).width
        ctx.fillStyle = "#ffff00"
        ctx.font = "12px Minecraft"
        ctx.fillText(element.id, x + size + 2, y - 1)
        // TODO: Add select context
        if(element.isEnumerable){
            x += 12
            drawTreeUndChildren(element)
            x -= 12
        }
    })
}

document.getElementById("prev").addEventListener("click", () => {
    update(wgm.selectedContext - 1)
})

document.getElementById("next").addEventListener("click", () => {
    update(wgm.selectedContext + 1)
})

setInterval(() =>{wgm.draw()}, 16)