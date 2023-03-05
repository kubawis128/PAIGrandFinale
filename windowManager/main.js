import {Renderer} from "./renderer.js";
import {Window} from "./window.js";
import {Desktop, Icon} from "./desktop.js";
import {Loader} from "./assetManager.js";

// Applications
import {Game} from "../tetris/tetris.js"
import {DOOM} from "../doom/doom.js";


let assetLoader = new Loader();

let renderer = new Renderer(document.getElementById("screen"))

let desk = new Desktop(renderer,assetLoader.assets.desktop.wallpaper)

let icons = []
icons.push(new Icon(100, 100, "Tetris", assetLoader.assets.icons.tetris, () => {
    let tetrisWindow = new Window(100,200, 300, 440, "Tetris.js")
    renderer.addWindow(tetrisWindow)
    new Game(tetrisWindow.canvas)
}))

icons.push(new Icon(200, 100, "DOOM", assetLoader.assets.icons.doom, () => {
    let doomWindow = new Window(100,200, 640, 400, "DOOM",renderer)
    
    doomWindow.canvas.setAttribute("tabindex", "0"); 

    let doom_instance = new DOOM(doomWindow.canvas, doomWindow)
    doomWindow.instance = doom_instance

    renderer.addWindow(doomWindow)
}))

document.addEventListener("mousedown", (event) => {
    //console.log(event)
    if(event.target.id == "screen"){
        icons.forEach(icon => {
            if(icon.check_collision(event.clientX, event.clientY)){
                icon.exec()
            }
        })
        let clickedWindow = renderer.getClickedWindow(event.clientX, event.clientY)
        if(clickedWindow && clickedWindow.action == "close"){
            renderer.closeWindow(clickedWindow.window)
        }
    }
})

let dragged_window = null
document.addEventListener("mousedown", (event) => {
    if(event.target.id == "screen"){
        let clicked = renderer.getClickedWindow(event.clientX, event.clientY)
        console.log(clicked)
        if(clicked){
            dragged_window = clicked.window
            dragged_window.setHolding(event.clientX, event.clientY)
        }
        
    }
})

document.addEventListener("mousemove", (event) => {
    if(dragged_window && event.target.id == "screen"){
        dragged_window.x -= dragged_window.holdingX - event.clientX
        dragged_window.y -= dragged_window.holdingY - event.clientY
        dragged_window.setHolding(event.clientX, event.clientY)
        update()
    }
    if(dragged_window && event.target.id != "screen"){
        dragged_window = null
    }
})

document.addEventListener("mouseup", (event) => {
    if(event.target.id == "screen"){
        dragged_window = null
    }
})

setInterval(function (){
    update()
  }, 16);

function update(){
    desk.draw()
    desk.drawIcons(icons)
    renderer.updateWindows()
}