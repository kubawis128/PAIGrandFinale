import {Renderer} from "./renderer.js"
import {Window} from "./window.js"
import {Desktop, Icon} from "./desktop.js"
import {Loader} from "./assetManager.js"

// Applications
import {Game} from "../apps/tetris/tetris.js"
import {DOOM} from "../apps/doom/doom.js"
import {CalcWGM} from "../apps/calc/main.js"

import {MusicPlayerWGM} from "../apps/musicPlayer-WGM/main.js"
import {VideoPlayerWGM} from "../apps/videoPlayer/main.js"
import {WeatherWGM} from "../apps/weather/main.js"

let assetLoader = new Loader()

let renderer = new Renderer(document.getElementById("screen"))

let desk = new Desktop(renderer,assetLoader.assets.desktop.wallpaper)
console.log(assetLoader)
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

    calcWindow.instance = new CalcWGM(calcWindow.inner, assetLoader)

    renderer.addWindow(calcWindow)
}))

icons.push(new Icon(400, 100, "Video Player", assetLoader.assets.icons.music, () => {
    let calcWindow = new Window(100,300, 640, 550, "Video Player","canvas",renderer)

    calcWindow.instance = new VideoPlayerWGM(calcWindow.inner,assetLoader)
    
    calcWindow.instance.window = calcWindow

    renderer.addWindow(calcWindow)
}))

icons.push(new Icon(500, 100, "Music Player", assetLoader.assets.icons.music, () => {
    let calcWindow = new Window(100,300, 400, 300, "Music Player WGM","canvas",renderer)

    calcWindow.instance = new MusicPlayerWGM(calcWindow.inner,assetLoader)

    renderer.addWindow(calcWindow)
}))

icons.push(new Icon(700, 100, "Current Weather", assetLoader.assets.icons.music, () => {
    let calcWindow = new Window(100,300, 400, 150, "Weather","canvas",renderer)

    calcWindow.instance = new WeatherWGM(calcWindow.inner,assetLoader)

    renderer.addWindow(calcWindow)
}))

document.addEventListener("mousedown", (event) => {
    let index = -1
    let clickedWindow = renderer.window_list.find((value) => {
        index += 1
        return value.uuid == event.target.id 
    })
    let tmp = renderer.getClickedWindow(event.clientX, event.clientY)
    if(!clickedWindow){
        if(tmp){
            clickedWindow = tmp.window
            index = renderer.window_list.indexOf(clickedWindow)
        }
    }

    if(clickedWindow){
        // bring the window to the front
        //let index = renderer.window_list.indexOf(clickedWindow.window)
        renderer.window_list.splice(index,1)
        renderer.window_list.unshift(clickedWindow)  
        
        let i = 0
        renderer.window_list.forEach(window => {
            window.changeZIndex(i)
            i += 1
        })
    }
    if(event.target.id == "screen") {
        icons.forEach(icon => {
            if(icon.check_collision(event.clientX, event.clientY)){
                icon.exec()
            }
        })
    }
    if(event.target.id == "titlebar"){
        if(clickedWindow){
            dragged_window = clickedWindow
            clickedWindow.setHolding(event.clientX, event.clientY)
            if(tmp.action == "close"){
                renderer.closeWindow(clickedWindow)
            } 
            console.log(tmp)
            if(tmp.action == "minimize"){
                console.warn("try minimize window")
                clickedWindow.minimize()
            }
        }
    }else{
        if(clickedWindow){
            clickedWindow.handleClick(event.clientX, event.clientY)
        }
    }
            
    let x = 86
    renderer.window_list.forEach((window) => {
        if(event.clientX >= x-2 && event.clientX <= x + renderer.ctx.measureText(window.title).width+4  && event.clientY >= 1080-28  && event.clientY <=  1080-4){
            console.log(window.zIndex)
            if(window.minimized){
                window.switchMinimized()
            }else{
                if(window.zIndex == 0){
                    window.switchMinimized()
                }else{
                    let index = renderer.window_list.indexOf(window)
                    renderer.window_list.splice(index,1)
                    renderer.window_list.unshift(window)  
                    let i = 0
                    renderer.window_list.forEach(window2 => {
                        window2.changeZIndex(i)
                        i += 1
                    })
                }
            }
        }
        x += renderer.ctx.measureText(window.title).width + 8
    })
})

let dragged_window = null
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

document.addEventListener("mouseup", () => {
    dragged_window = null
})

setInterval(function (){
    update()
}, 16)

function update(){
    desk.draw()
    desk.drawIcons(icons)
    renderer.updateWindows()
}