export class Loader{
    constructor(){

        let assets = {
            icons: {
                doom: "doom.png",
                tetris: "tetris.png",
                music: "music.png",
            },
            desktop: {
                wallpaper: "wallpaper.png",
            },
            musicPlayer: {
                glamour: "glamour.png",
                layout: "layout.json",
            },
        }
        this.assets = {} 
        this.addToList(this.assets,assets,"/assets/")
    }

    async addToList(toSave,items,path){
        for(var key in items){
            if(typeof items[key] == "object"){
                toSave[key] = {}
                this.addToList(toSave[key],items[key],path + key + "/" )
            }else{
                console.log("add to object", items[key])
                let file = null
                switch (items[key].split(".").at(-1)){
                case "jpg":
                case "png":
                case "jpeg":
                    file = new Image()
                    file.src = path + items[key]
                    file.onload = (loaded) => {
                        let loaded_img = loaded.target
                        loaded_img.width = loaded_img.naturalWidth
                        loaded_img.height = loaded_img.naturalHeight
                    }
                    break
                case "json":
                    // eslint-disable-next-line no-case-declarations
                    let request = await fetch(path + items[key])
                    file = await request.text()
                    break
                }

                toSave[key] = file
            }   
        }
    }
    
}