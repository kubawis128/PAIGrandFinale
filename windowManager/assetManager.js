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
            },
        }
        this.assets = {} 
        this.addToList(this.assets,assets,"/assets/")
    }

    addToList(toSave,items,path){
        for(var key in items){
            if(typeof items[key] == "object"){
                toSave[key] = {}
                this.addToList(toSave[key],items[key],path + key + "/" )
            }else{
                console.log("add to object", items[key])
                let image = new Image()
                image.src = path + items[key];
                image.onload = (loaded) => {
                    let loaded_img = loaded.target
                    loaded_img.width = loaded_img.naturalWidth
                    loaded_img.height = loaded_img.naturalHeight
                }
                toSave[key] = image
            }   
        }
    }
    
}