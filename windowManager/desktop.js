export class Desktop{
    constructor(renderer, wallpaper){
        this.renderer = renderer
        this.canvas = renderer.canvas
        this.ctx = renderer.ctx
        this.wallpaper = wallpaper
    }
    
    draw(){
        // Background
        if(this.wallpaper == null){
            this.renderer.fillScreen("#252525")
        }else{
            this.renderer.fillScreen("#252525")
            this.ctx.drawImage(this.wallpaper, 0, 0)
        }
        
        // Task Bar
        this.ctx.fillStyle = "#696969"
        this.ctx.fillRect(0, this.canvas.height-32, this.canvas.width, this.canvas.height)

        // Start button
        this.ctx.fillStyle = "#3E54AC"
        this.ctx.fillRect(4, this.canvas.height-28, 78, 24)

        // Start button Text
        this.ctx.font = "24px Minecraft";
        this.ctx.fillStyle = "#FFFFFF"
        this.ctx.fillText("Start", 12, this.canvas.height-28+22);

        // Clock
        let date = new Date()
        var options = {hour: '2-digit',minute: '2-digit', second: '2-digit'}
        const dateTimeFormat = new Intl.DateTimeFormat('pl-PL', options);

        let date_str = ""
        dateTimeFormat.formatToParts(date).forEach(e => {date_str += e.value})
        this.ctx.font = "24px Minecraft";
        this.ctx.fillStyle = "#FFFFFF"
        this.ctx.fillText(date_str, this.canvas.width-(this.ctx.measureText(date_str).width), this.canvas.height-28+22);
    }

    drawIcons(icons){
        this.ctx.font = "24px Minecraft";
        icons.forEach(icon => {
            this.ctx.drawImage(icon.texture, icon.x, icon.y)
            this.ctx.fillStyle = "#FFFFFF"
            this.ctx.fillText(icon.name, icon.x-3, icon.y+88);
        });
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