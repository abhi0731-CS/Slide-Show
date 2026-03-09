const slideImg=document.getElementById("slide")
const prev=document.getElementById("prev")
const next=document.getElementById("next")

const startBtn=document.getElementById("start")
const stopBtn=document.getElementById("stop")
const saveBtn=document.getElementById("saveJson")

const jsonEditor=document.getElementById("jsonEditor")
const applyBtn=document.getElementById("applyJson")

let raw=sessionStorage.getItem("slideshowData")

let slides=[]
let delay=5000

if(raw){

try{

let data=JSON.parse(raw)
slides=data.slides||[]
delay=data.delay||5000

}catch{}

}

let index=0
let timer=null

function show(){

if(!slides.length)return
slideImg.src=slides[index].src

}

function nextSlide(){

index=(index+1)%slides.length

}

function run(){

show()

let current=slides[index]

let slideDelay=current.time
? current.time*1000
: delay

timer=setTimeout(()=>{

nextSlide()
run()

},slideDelay)

}

function start(){

stop()
run()

}

function stop(){

clearTimeout(timer)

}

prev.onclick=()=>{

index=(index-1+slides.length)%slides.length
show()

}

next.onclick=()=>{

nextSlide()
show()

}

startBtn.onclick=start
stopBtn.onclick=stop

saveBtn.onclick=()=>{

const blob=new Blob(
[JSON.stringify({slides,delay})],
{type:"application/json"}
)

const a=document.createElement("a")

a.href=URL.createObjectURL(blob)
a.download="slideshow.json"

a.click()

}

show()
start()

/* ---------------- JSON EDITOR ---------------- */
function loadJsonEditor(){

let simple = slides.map((s,i)=>({
slide:i+1,
time:s.time || delay/1000
}))

jsonEditor.value = JSON.stringify(simple,null,2)

}

loadJsonEditor()


applyBtn.onclick=()=>{

try{

let edited = JSON.parse(jsonEditor.value)

edited.forEach((s,i)=>{

if(slides[i]){
slides[i].time = Number(s.time)
}

})

index=0

stop()
start()

sessionStorage.setItem(
"slideshowData",
JSON.stringify({slides,delay})
)

loadJsonEditor()

}catch{

alert("Invalid JSON")

}

}

/*BUTTON TO FULL SCREEN & LEFT RIGHT*/
const slideshowDiv = document.getElementById("slideshow")
const fullscreenBtn = document.getElementById("fullscreen")

fullscreenBtn.onclick = toggleFullscreen

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // request fullscreen only for slideshow div
    slideshowDiv.requestFullscreen().catch(err => {
      console.error("Fullscreen failed:", err)
    })
  } else {
    document.exitFullscreen()
  }
}

// Optional: keyboard F key toggle for slideshow div
document.addEventListener("keydown", (e) => {
  if (e.key === "f" || e.key === "F") toggleFullscreen()
  
  if (e.key === "ArrowLeft") prev.click()
  if (e.key === "ArrowRight") next.click()
})
