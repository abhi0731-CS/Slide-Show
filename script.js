const upload=document.getElementById("upload")
const gallery=document.getElementById("gallery")
const slideBtn=document.getElementById("slideshowSelected")
const slideTimeInput=document.getElementById("slideTime")

const slideshowQueue=document.getElementById("slideshowQueue")
const clearQueueBtn=document.getElementById("clearQueue")

const loadJsonBtn=document.getElementById("loadJsonBtn")
const jsonInput=document.getElementById("jsonInput")

const preview=document.getElementById("preview")
const previewImg=document.getElementById("previewImg")

const customizeBtn=document.getElementById("customizeBtn")

let photos=[]
let queue=[]
let dragIndex=null
let customizeMode=false

/* compress image */

function compressImage(file,callback){

const reader=new FileReader()

reader.onload=function(e){

const img=new Image()

img.onload=function(){

const canvas=document.createElement("canvas")
const maxWidth=800
const scale=maxWidth/img.width

canvas.width=maxWidth
canvas.height=img.height*scale

const ctx=canvas.getContext("2d")
ctx.drawImage(img,0,0,canvas.width,canvas.height)

callback(canvas.toDataURL("image/jpeg",0.7))

}

img.src=e.target.result

}

reader.readAsDataURL(file)

}

/* upload */

upload.addEventListener("change",e=>{

[...e.target.files].forEach(file=>{

compressImage(file,(compressed)=>{

photos.push(compressed)
renderGallery()

})

})

})

/* gallery */

function renderGallery(){

gallery.innerHTML=""

photos.forEach(src=>{

const card=document.createElement("div")
card.className="photo-card"

const img=document.createElement("img")
img.src=src

img.onclick=()=>{

queue.push({src:src,time:null})
renderQueue()

}

img.oncontextmenu=(e)=>{

e.preventDefault()
previewImg.src=src
preview.style.display="flex"

}

card.appendChild(img)
gallery.appendChild(card)

})

}

/* slideshow order */

function renderQueue(){

slideshowQueue.innerHTML=""

queue.forEach((item,index)=>{

const box=document.createElement("div")
box.className="slideItem"

const img=document.createElement("img")
img.src=item.src
img.draggable=true

const time=document.createElement("input")
time.type="number"
time.placeholder="sec"

if(item.time!==null){
time.value=item.time
}

time.onchange=()=>{
queue[index].time=time.value===""?null:parseInt(time.value)
}

img.onclick=()=>{
queue.splice(index,1)
renderQueue()
}

img.ondragstart=()=>{dragIndex=index}
img.ondragover=(e)=>e.preventDefault()

img.ondrop=()=>{
const moved=queue.splice(dragIndex,1)[0]
queue.splice(index,0,moved)
renderQueue()
}

box.appendChild(img)
box.appendChild(time)

slideshowQueue.appendChild(box)

})

}

clearQueueBtn.onclick=()=>{

queue=[]
renderQueue()

}

/* start slideshow */

slideBtn.onclick=()=>{

if(!queue.length){
alert("Add images first!")
return
}

sessionStorage.removeItem("slideshowData")

sessionStorage.setItem("slideshowData",
JSON.stringify({
slides:queue,
delay:slideTimeInput.value*1000
})
)

window.open("slideshow.html","_blank")

}

/* load json */

loadJsonBtn.onclick=()=>jsonInput.click()

jsonInput.onchange=(e)=>{

const file=e.target.files[0]
if(!file)return

const reader=new FileReader()

reader.onload=()=>{
sessionStorage.removeItem("slideshowData")
sessionStorage.setItem("slideshowData",reader.result)
window.open("slideshow.html","_blank")
}

reader.readAsText(file)

}

/* preview */

preview.onclick=()=>preview.style.display="none"

/* customize UI */

customizeBtn.onclick=()=>{

customizeMode=!customizeMode

customizeBtn.textContent=
customizeMode?"Finish Customize":"Customize UI"

}

/* drag system */

const movableElements=document.querySelectorAll(".movable")

let active=false
let current=null
let offsetX=0
let offsetY=0

movableElements.forEach(el=>{

el.addEventListener("mousedown",(e)=>{

if(!customizeMode)return

active=true
current=el

offsetX=e.clientX-el.offsetLeft
offsetY=e.clientY-el.offsetTop

})

})

document.addEventListener("mousemove",(e)=>{

if(!active)return

current.style.left=(e.clientX-offsetX)+"px"
current.style.top=(e.clientY-offsetY)+"px"

})

document.addEventListener("mouseup",()=>{

active=false

})
