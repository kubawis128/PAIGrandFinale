# PAIGrandFinale
Final *Big* Project for PAI lessons

# Code Walkthrough

## /assets/

This directory contains all icons, fonts, etc.

This folder is used only by `assetManager.js` file

___

## /doom/

### Playable doom in browser using the power of WebAssembly
### Using my fork of doom in WebAssembly

| file          | function              |
|:---:          |---                    |
|doom.js        |This file loads needed scripts(mus2midi.js, pcm-player.js&midi.js) and then initiates my fork of doom.wasm|
|mus2midi.js    |Converts doom MUS sound format into playable midi files|
|pcm-player     |Library that can play raw samples of music|
|doom.wasm      |My fork of doom in webAssembly from [this repo](https://github.com/diekmann/wasm-fizzbuzz) with added sound support (for more look [here](https://github.com/kubawis128/wasm-fizzbuzz))|

___

## /tetris/

### My take on tetris
### Made using only canvas without using any external libraries
### At first it was supposed to be the final project but it evolved into a full desktop

| file          | function              |
|:---:          |---                    |
|debug.js       |Implements a debug collision renderer|
|grid.js        |Game base element. The playing field|
|piece.js       |Contains pieces definitions and calculates collisions|
|playingPiece.js|Object holding current playing piece location. Also can rotate the piece in question|
|renderer.js    |Main game renderer. Can draw grid, score and playing piece|
|tetris.js      |The glue and main game logic of tetris. It loads all the above files and implements a game loop|

___

## /windowManager/

### Desktop renderer and apps handler

| file          | function              |
|:---:          |---                    |
|assetManager.js|Used to load all needed images and other assets. And then you can reference a loaded texture like `assetLoader.assets.icons.tetris`|
|desktop.js     |Object to render wallpaper and desktop icons (also handles icon clicks)|
|main.js        |Entry script that loads other scripts and initiates them|
|renderer.js    |Handles windows and screen clearing|
|window.js      |Window object holding things like:  `location`, `draw` function, `destroy` function