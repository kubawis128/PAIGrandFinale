# Feature Matrix

||Status|
|-|-------|
|✅|**Working**|
|⚠️|**Problematic or subject to change**|
|❌|**Not Working**|
|-| **not applicable**

|Feature|List|Grid|Image|Text|Button|Slider|HTMLElement|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|padding|✅|✅|✅|✅|✅|✅|✅|
|color|-|-|❌|✅|✅|✅|❌|
|backgroundColor|❌|❌|❌|❌|✅|✅|❌|
|rounded|-|-|✅|-|✅|✅|-|
|xOffset|✅|✅|✅|✅|✅|✅|✅|
|yOffset|✅|✅|✅|✅|✅|✅|✅|
|align|❌|✅|❌|✅|❌|❌|❌|

# General Element Tags
`x,y` - static coordinates

`width,height` - size of the element (used for list and grid)

`color` - usually the color of text inside the element

`padding` - space between this element and other one

`xOffset,yOffset` - like padding but splitted into axes x and y

`rounded` - specifies the roundness of the element

`align` - how the element will be positioned

# Element Specific Tags

## Image

`src` - Source of the image (relative path from `/assets/`)

## Text
`font` - Font size and family like `32px Minecraft`

`content` - content of the text element

## Button

`font` - Font size and family like `32px Minecraft`

`content` - content of the text element

`innerPadding` - distance from text to outer edge of the button

## Slider

`position` - What is the progress of the bar from 0 to 100

`sliderType` - Whether it is `vertical` or `horizontal`


## HTMLElement

`HTMLtag` - specifies what will the HTML tag will be