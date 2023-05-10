export class DOOM{
    constructor(canvas, myWindow){
        myWindow.inner.setAttribute("tabindex", "0") 
        this.running = true
        let script = document.createElement("script")
        script.src = "https://www.midijs.net/lib/midi.js"
        this.script = document.body.appendChild(script)
        let script1 = document.createElement("script")
        script1.src = "/apps/doom/pcm-player.js"
        this.script1 = document.body.appendChild(script1)
        let script2 = document.createElement("script")
        script2.src = "/apps/doom/mus2midi.js"
        this.script2 = document.body.appendChild(script2)
        this.memory = new WebAssembly.Memory({ initial : 108 })
        var memory = this.memory
        this.running = true
        this.myWindow = myWindow
        var selfe = this
        function getMilliseconds() {
            return performance.now()
        }

        /*doom is rendered here*/
        const doom_screen_width = 320*2
        const doom_screen_height = 200*2

        function drawCanvas(ptr) {
            var doom_screen = new Uint8ClampedArray(memory.buffer, ptr, doom_screen_width*doom_screen_height*4)
            var render_screen = new ImageData(doom_screen, doom_screen_width, doom_screen_height)
            var ctx = canvas.getContext("2d")

            ctx.putImageData(render_screen, 0, 0)
        }
        function playMusic(ptr, length, looping){
            var doom_screen = new Uint8ClampedArray(memory.buffer, ptr, length)
            let midi = mus2midi(doom_screen)
            if(looping == 0){
                MIDIjs.play(URL.createObjectURL(new Blob([midi])))
            }else{
                playAutoReset(URL.createObjectURL(new Blob([midi])))
            }
        }
        
        function playAutoReset(url)
        {
            MIDIjs.get_duration(url, function (duration)
            { 
                MIDIjs.play(url)
                MIDIjs.player_callback = function (mes)
                {
                    if (mes.time / duration >= 1)
                    {
                        MIDIjs.play(url)
                    }
                }
            })
        }
        
        function playSound(ptr, size,vol, sep, pitch){
            console.log(this)
            var doom_screen = new Uint8ClampedArray(memory.buffer, ptr, size)
            initAudio(doom_screen,vol,pitch)
        }

        function destroyApp(){
            console.log("Stop running")
            selfe.destroyApp()
        }

        /*These functions will be available in WebAssembly. We also share the memory to share larger amounts of data with javascript, e.g. strings of the video output.*/
        var importObject = {
            js: {
                js_console_log: (e)=>{console.log(e)},
                js_stdout: (e)=>{console.log(e)},
                js_stderr: (e)=>{console.log(e)},
                js_milliseconds_since_start: getMilliseconds,
                js_draw_screen: drawCanvas,
                js_play_sound: playSound,
                js_play_music: playMusic,
                js_destroy: destroyApp,
            },
            env: {
                memory: memory
            }
        }

        this.WebAssembly = WebAssembly.instantiateStreaming(fetch("apps/doom/doom.wasm"), importObject)
        console.log(this.WebAssembly)
        this.WebAssembly.then(obj => {
            /*Initialize Doom*/
            obj.instance.exports.main()


            /*input handling*/
            let doomKeyCode = function(keyCode) {
                // Doom seems to use mostly the same keycodes, except for the following (maybe I'm missing a few.)
                switch (keyCode) {
                case 8:
                    return 127 // KEY_BACKSPACE
                case 17:
                    return (0x80+0x1d) // KEY_RCTRL
                case 18:
                    return (0x80+0x38) // KEY_RALT
                case 37:
                    return 0xac // KEY_LEFTARROW
                case 38:
                    return 0xad // KEY_UPARROW
                case 39:
                    return 0xae // KEY_RIGHTARROW
                case 40:
                    return 0xaf // KEY_DOWNARROW
                default:
                    if (keyCode >= 65 /*A*/ && keyCode <= 90 /*Z*/) {
                        return keyCode + 32 // ASCII to lower case
                    }
                    if (keyCode >= 112 /*F1*/ && keyCode <= 123 /*F12*/ ) {
                        return keyCode + 75 // KEY_F1
                    }
                    return keyCode
                }
            }
            let keyDown = function(keyCode) {obj.instance.exports.add_browser_event(0 /*KeyDown*/, keyCode)}
            let keyUp = function(keyCode) {obj.instance.exports.add_browser_event(1 /*KeyUp*/, keyCode)}

            /*keyboard input*/
            canvas.addEventListener("keydown", function(event) {
                keyDown(doomKeyCode(event.keyCode))
                event.preventDefault()
            }, false)
            canvas.addEventListener("keyup", function(event) {
                keyUp(doomKeyCode(event.keyCode))
                event.preventDefault()
            }, false);

            /*mobile touch input*/
            [["enterButton", 13],
                ["leftButton", 0xac],
                ["rightButton", 0xae],
                ["upButton", 0xad],
                ["downButton", 0xaf],
                ["ctrlButton", 0x80+0x1d],
                ["spaceButton", 32],
                ["altButton", 0x80+0x38]].forEach(([elementID, keyCode]) => {
                console.log(elementID + " for " + keyCode)
            })

            canvas.focus()

            /*Main game loop*/
            function step(timestamp) {
                if(selfe.running){
                    obj.instance.exports.doom_loop_step()
                    window.requestAnimationFrame(step)
                }else{
                    console.warn("LastStep done")
                }
            }
            window.requestAnimationFrame(step)
        })
    }
    destroyApp(){
        this.script.remove()
        this.script1.remove()
        this.script2.remove()
        console.warn("Destroy called")
        this.running = false
        delete this.WebAssembly
        delete this.memory
        this.myWindow.destroyUI()
        MIDIjs.stop()
    }
    destroy(){
        this.script.remove()
        this.script1.remove()
        this.script2.remove()
        console.warn("Destroy called")
        this.running = false
        delete this.WebAssembly
        delete this.memory
        MIDIjs.stop()
    }
}
