export class Desktop{
    constructor(renderer, wallpaper, icons){
        this.renderer = renderer
        this.canvas = renderer.canvas
        this.ctx = renderer.ctx
        this.wallpaper = wallpaper
        this.icons = icons
    }
    
    draw(){
        
        // Background
        this.renderer.fillScreen("#252525")
        if(this.wallpaper != null){
            this.ctx.drawImage(this.wallpaper, 0, 0,)
        }
        
        // Icons
        this.ctx.font = "24px Minecraft"
        this.icons.forEach(icon => {
            this.ctx.drawImage(icon.texture, icon.x, icon.y,64,64)
            this.ctx.fillStyle = "#FFFFFF"
            this.ctx.fillText(icon.name, icon.x + ((64 - this.ctx.measureText(icon.name).width)/2), icon.y+88)
        })

        // Task Bar
        this.ctx.fillStyle = "#696969"
        this.ctx.fillRect(0, this.canvas.height-32, this.canvas.width, this.canvas.height)
        
        // Task Bar Items
        let x = 86
        this.renderer.window_list.forEach((window) => {
            this.ctx.fillStyle = "#252525"
            this.ctx.fillRect(x-2, this.canvas.height-28, this.ctx.measureText(window.title).width+4, 24)
            this.ctx.font = "24px Minecraft"
            this.ctx.fillStyle = "#FFFFFF"
            this.ctx.fillText(window.title, x, this.canvas.height-28+22)
            x += this.ctx.measureText(window.title).width + 8
        })



        // Start button
        this.ctx.fillStyle = "#3E54AC"
        this.ctx.fillRect(4, this.canvas.height-28, 78, 24)

        // Start button Text
        this.ctx.font = "24px Minecraft"
        this.ctx.fillStyle = "#FFFFFF"
        this.ctx.fillText("Start", 12, this.canvas.height-28+22)

        // Clock
        let date = new Date()
        var options = {hour: "2-digit",minute: "2-digit", second: "2-digit"}
        const dateTimeFormat = new Intl.DateTimeFormat("pl-PL", options)

        let date_str = ""
        dateTimeFormat.formatToParts(date).forEach(e => {date_str += e.value})
        this.ctx.font = "24px Minecraft"
        this.ctx.fillStyle = "#FFFFFF"
        this.ctx.fillText(date_str, this.canvas.width-(this.ctx.measureText(date_str).width), this.canvas.height-28+22)

        // Draw start menu
        if(this.opened_menu){
            this.ctx.fillStyle = "#2f2f2f"
            this.ctx.fillRect(0,1080-600,400,600-32)
            let y = 1080-600+4
            this.ctx.font = "32px Minecraft"
            this.icons.forEach((icon) => {
                this.ctx.drawImage(icon.texture, 4, y,64,64)
                this.ctx.fillStyle = "#FFFFFF"
                this.ctx.fillText(icon.name, 72, y + 38)
                y += 64 + 12
            })
        }
    }
    switch_menu(){
        this.opened_menu = !this.opened_menu
    }

    check_collision_on_menu(x,y){
        let yOff = 0
        this.ctx.font = "32px Minecraft"
        let found = null
        this.icons.forEach((icon) => {
            if(y >= yOff && y <= yOff + 64 + 12){
                found = icon
            }
            yOff += 64 + 12
        })
        if(found){
            found.exec()
            this.opened_menu = false
        }
    }
}
export class Icon{

    constructor(x, y, name, texture, exec){
        this.x = x
        this.y = y
        this.name = name
        this.texture = texture
        this.exec = exec
    }

    check_collision(x, y){
        if(this.x <= x && this.x + 64 >= x){
            if(this.y <= y && this.y + 88 >= y){
                return true
            }
        }
        return false
    }
}