import {Renderer} from "./renderer.js";
import {Window} from "./window.js";
import {Desktop, Icon} from "./desktop.js";
import {Loader} from "./assetManager.js";

// Applications
import {Game} from "../tetris/tetris.js"
import {DOOM} from "../doom/doom.js";
import {Calc} from "../calc/main.js";

import {MusicPlayer} from "../musicPlayer/main.js";

let assetLoader = new Loader();

let renderer = new Renderer(document.getElementById("screen"))

let desk = new Desktop(renderer,assetLoader.assets.desktop.wallpaper)

let icons = []
icons.push(new Icon(100, 100, "Tetris", assetLoader.assets.icons.tetris, () => {
    let tetrisWindow = new Window(100,200, 300, 440, "Tetris.js", "canvas")

    renderer.addWindow(tetrisWindow)

    new Game(tetrisWindow.inner)
}))

icons.push(new Icon(200, 100, "DOOM", assetLoader.assets.icons.doom, () => {
    let doomWindow = new Window(100,200, 640, 400, "DOOM","canvas", renderer)

    doomWindow.instance = new DOOM(doomWindow.inner, doomWindow)

    renderer.addWindow(doomWindow)
}))

icons.push(new Icon(300, 100, "Calculator", assetLoader.assets.icons.doom, () => {
    let calcWindow = new Window(100,200, 360, 500, "Calculator","canvas",renderer)

    calcWindow.instance = new Calc(calcWindow.inner, calcWindow)

    renderer.addWindow(calcWindow)
}))

icons.push(new Icon(400, 100, "Music Player", assetLoader.assets.icons.doom, () => {
    let calcWindow = new Window(100,300, 400, 480, "Music Player","canvas",renderer)

    calcWindow.instance = new MusicPlayer(calcWindow.inner)

    renderer.addWindow(calcWindow)
}))

document.addEventListener("mousedown", (event) => {
    //console.log(event)
    if(event.target.id == "screen" || event.target.id == "titlebar"){
        icons.forEach(icon => {
            if(icon.check_collision(event.clientX, event.clientY)){
                icon.exec()
            }
        })

        let clickedWindow = renderer.getClickedWindow(event.clientX, event.clientY)
        if(clickedWindow && clickedWindow.action == "close"){
            renderer.closeWindow(clickedWindow.window)
        }
        if(clickedWindow && clickedWindow.action == "minimize"){
            console.warn("try minimize window")
            clickedWindow.window.minimize()
        }

        let x = 86
        renderer.window_list.forEach((window) => {
            if(event.clientX >= x-2 && event.clientX <= x + renderer.ctx.measureText(window.title).width+4  && event.clientY >= 1080-28  && event.clientY <=  1080-4){
                window.switchMinimized()
            }
            x += renderer.ctx.measureText(window.title).width + 8
        })
    }
})

let dragged_window = null
document.addEventListener("mousedown", (event) => {
    if(event.target.id == "screen" || event.target.id == "titlebar"){
        let clicked = renderer.getClickedWindow(event.clientX, event.clientY)
        console.log(clicked)
        if(clicked){
            dragged_window = clicked.window
            dragged_window.setHolding(event.clientX, event.clientY)
        }
        
    }
})

document.addEventListener("mousemove", (event) => {
    if(dragged_window && (event.target.id == "screen" || event.target.id == "titlebar")){
        dragged_window.x -= dragged_window.holdingX - event.clientX
        dragged_window.y -= dragged_window.holdingY - event.clientY
        dragged_window.setHolding(event.clientX, event.clientY)
        update()
    }
    /*if(dragged_window && (event.target.id != "screen" || event.target.id != "titlebar")){
        dragged_window = null
    }*/
})

document.addEventListener("mouseup", (event) => {
    if(event.target.id == "screen" || event.target.id == "titlebar"){
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