import './libs/webaudio-controls.js';

const getBaseURL = () => {
	return new URL('.', import.meta.url);
};

const template = document.createElement("template");
template.innerHTML = /*html*/`

<style>

  img{
    height: 30px;
    width: 30px;
  }

  #audioGraph{
    border:1px solid black;
  }

  #audioFreq{
    border:1px solid black;
  }

  button {
    transition-duration: 0.4s;
    background-color: #dff2ff;
    border: 1px solid white; 
  }

  button:hover{
    background-color: #4682B4;
    color: white;
  }

  .mainContainer{
    display:flex;
    flex-direction: column;
    width:400px;
    height:50px;
  }

  .containerButton{
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    width:400px;
    height:50px;
  }

  .mainButton{
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
  }

  .muteButton{
    display:flex;
    fex-direction:row;
    justify-content: center;
    align-items: center;
  }

  .sliderContainer{
    display:flex;
    fex-direction:row;
    justify-content: center;
    align-items: center;
  }

  webaudio-controls{
    position:absolute;
    left:731px;
    top:64px;
  } 

</style>

<audio id="player" crossorigin="anonymous"></audio>

<br>
<div class="mainContainer">

  <div class="containerButton">
  <div></div>
    <div class="mainButton">
      <button id="playBtn">
        <img id ="play" src="/assets/imgs/play-solid.png"></img>
      </button>

      <button id="back">
        <img src="/assets/imgs/square-solid.png"></img>
      </button>
    </div>

    <div class="muteButton">
      <button id="mute">
        <img id ="sound" src="/assets/imgs/volume-mute-solid.png"></img>
      </button>

      <webaudio-knob id="volume" 
      src="/assets/imgs/MiniMoog_Main.png"
      value=0.5 min=0 max=1 step=0.01
      diameter="50" 
      tooltip="Volume: %s">
      </webaudio-knob>
    </div>
  </div>
  
  <div class="canvasContainer">
    <canvas id="audioGraph" width="400"></canvas>
  </div>
  
  <canvas id="audioFreq" width="400"></canvas>
  
  <div class="sliderContainer">
    <label> Progression
      <input id="progress" type="range" value=0>
    </label>
    <span id="currentTime"></span> /
    <span id="duration"></span>

    <button id="loop">
      <img src="/assets/imgs/undo-alt-solid.png"></img>
    </button>    
  </div>

  <div>
    <label>Speed
        <input type="range" min="0.5" max="2" step=".25" value="1" id="speed">
        <span id="displayVolume"></span>
      </label>
  </div>

  <div>
  <webaudio-knob id="slider60"  
  src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
  value=0 min=-15 max=15 step=1
  tooltip="Value: %s"
  sprites="200"
  >
  </webaudio-knob>
  <webaudio-knob id="slider170"  
  src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
  value=0 min=-15 max=15 step=1
  tooltip="Value: %s"
  sprites="200"
  >
  </webaudio-knob>
  <webaudio-knob id="slider350"  
  src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
  value=0 min=-15 max=15 step=1
  tooltip="Value: %s"
  sprites="200"
  >
  </webaudio-knob>
  <webaudio-knob id="slider1000"  
  src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
  value=0 min=-15 max=15 step=1
  tooltip="Value: %s"
  sprites="200"
  >
  </webaudio-knob>
  <webaudio-knob id="slider3500"  
  src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
  value=0 min=-15 max=15 step=1
  tooltip="Value: %s"
  sprites="200"
  >
  </webaudio-knob>
  <webaudio-knob id="slider10k"  
  src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
  value=0 min=-15 max=15 step=1
  tooltip="Value: %s"
  sprites="200"
  >
  </webaudio-knob>
  </div>
  

</div>

 
`;

class MyPlayer extends HTMLElement {

  fftSize = 512;
  mapSlider = new Map();

  constructor() {
    super();
    this.speed = 1;
    this.volume=1;
    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    console.log("URL de base du composant : " + getBaseURL())
  }

  connectedCallback() {
    this.player = this.shadowRoot.querySelector("#player");
    this.player.src = this.getAttribute("src");

    this.volume = this.shadowRoot.querySelector("#volume");
  
    this.slider60 = this.shadowRoot.querySelector("#slider60");

    this.audioCanvas = this.shadowRoot.querySelector("#audioGraph");
    this.audioCanvasContext = this.audioCanvas.getContext("2d");

    this.freqCanvas = this.shadowRoot.querySelector("#audioFreq");
    this.freqCanvasContext = this.freqCanvas.getContext("2d");

    this.mute = this.shadowRoot.querySelector("#mute");

    this.defineListeners();
    this.listenerSlider();
  }

  defineListeners(){

    this.shadowRoot.querySelector("#volume").oninput = (event) => {
      this.setVolume(event.target.value)
    }

    this.shadowRoot.querySelector("#speed").oninput = (event) => {
      this.setSpeed(event.target.value);
    }

    this.shadowRoot.querySelector("#playBtn").onclick = (event) => {
      this.onMusic();
    } 

    this.shadowRoot.querySelector("#mute").onclick = (event) =>{
      this.toMute();
    }

    this.shadowRoot.querySelector("#loop").onclick = (event) => {
      this.inLoop();
    }

    this.shadowRoot.querySelector("#progress").onchange = (event) => {
      this.player.currentTime = parseFloat(event.target.value);
    }

    this.shadowRoot.querySelector("#player").ontimeupdate = (event) => {
      this.progressBar();
    }

    this.shadowRoot.querySelector("#player").onplay = (event) => {
      if (this.audioContext === undefined){
        this.audioContext = new AudioContext();

        this.buildAudioGraph();

        requestAnimationFrame(() => {
          this.drawAudio();
          this.drawFrequenceAudio();
        });
      }
    }

    this.shadowRoot.querySelector("#back").onclick = (event) => {
      this.backToBeginning();
    }
    
  }

  setSpeed(value){
    this.player.playbackRate = value;
    this.shadowRoot.querySelector("#displayVolume").innerHTML = value;
    console.log(value)
  }

  setVolume(value){
    this.player.volume = value
    console.log(value)
  }

  onMusic(){
    if (!this.player.paused){
      this.player.pause();
      this.shadowRoot.querySelector("#play").src="/assets/imgs/play-solid.png";
    }
    else {
      this.player.play();
      this.shadowRoot.querySelector("#play").src="/assets/imgs/pause-solid.png";
    }
  }

  toMute(){
    this.player.muted = !this.player.muted;
    if(!this.player.muted){
      this.shadowRoot.querySelector("#sound").src="/assets/imgs/volume-mute-solid.png";
    }
    else{
      this.shadowRoot.querySelector("#sound").src = "/assets/imgs/volume-up-solid.png";
    }
  }

  inLoop(){
    this.player.loop = !this.player.loop;
  }

  convertElapsedTime(inputSeconds){
    let seconds = Math.floor(inputSeconds % 60);
    let minutes = Math.floor(inputSeconds / 60);
    
    if (seconds < 10){
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

  progressBar(){
    let progressSlider = this.shadowRoot.querySelector("#progress");
    let currentTime = this.player.currentTime;
    let duration = this.player.duration;

    progressSlider.max = duration;
    progressSlider.min = 0;
    progressSlider.value = currentTime;

    this.shadowRoot.querySelector("#currentTime").innerHTML = this.convertElapsedTime(currentTime);
    this.shadowRoot.querySelector("#duration").innerHTML = this.convertElapsedTime(duration);
  }

  buildAudioGraph(){

    let source = this.audioContext.createMediaElementSource(this.player);
    this.analyser = this.audioContext.createAnalyser();
    this.buildSlider(this.audioContext);

    this.analyser.fftSize = this.fftSize;
    this.sizeBuffer = this.analyser.frequencyBinCount;
    this.dataTable = new Uint8Array(this.sizeBuffer);

    let currentNode = source;
    for(let filter of this.mapSlider.values()){
      currentNode.connect(filter);
      currentNode = filter;
    }
    currentNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  buildSlider(context){
    var filters=[60,170,350,1000,3500,10000];
    var type = "peaking";

    filters.forEach(val => {
      const slider = context.createBiquadFilter();
      slider.frequency.value = val;
      slider.type = type;
      slider.gain.value = 0;
      this.mapSlider.set(val, slider);
    })
  }

  drawAudio(){

    this.audioCanvasContext.clearRect(0,0,this.audioCanvas.width,this.audioCanvas.height)

    this.audioCanvasContext.beginPath();

    this.analyser.getByteTimeDomainData(this.dataTable);

    this.audioCanvasContext.fillStyle = 'rgb(223, 242, 255)';
    this.audioCanvasContext.fillRect(0, 0, this.audioCanvas.width,this.audioCanvas.height);    

    var segmentWidth = this.audioCanvas.width / this.sizeBuffer;
    
    var x = 0;
    for(var i = 0; i < this.sizeBuffer; i++) {

      var v = this.dataTable[i] / 255;
      var y = v * this.audioCanvas.height;

      if(i === 0) {
        this.audioCanvasContext.moveTo(x, y);
      } 
      else {
        this.audioCanvasContext.lineTo(x, y);
      }

      x += segmentWidth;
      
    }

    this.audioCanvasContext.strokeStyle = 'rgb(3, 34, 76)';
    this.audioCanvasContext.stroke();

    requestAnimationFrame(() => {
      this.drawAudio();
    });
  }

  drawFrequenceAudio(){
    this.freqCanvasContext.clearRect(0, 0, this.freqCanvas.width, this.freqCanvas.height)

    this.analyser.getByteFrequencyData(this.dataTable);

    this.freqCanvasContext.fillStyle = 'rgb(223, 242, 255)';
    this.freqCanvasContext.fillRect(0, 0, this.freqCanvas.width,this.freqCanvas.height);

    let barWidth = this.freqCanvas.width / this.sizeBuffer;
    let barHeigth;
    var x=0;

    let heightScale = this.freqCanvas.height / this.fftSize;

    for(let i = 0; i < this.sizeBuffer; i++) {
      barHeigth = this.dataTable[i];

      this.freqCanvasContext.fillStyle = 'rgb(3,34,' + (barHeigth+100) + ')';
      barHeigth *= heightScale;
      this.freqCanvasContext.fillRect(x, this.freqCanvas.height - barHeigth/2, barWidth, barHeigth/2);

      x += barWidth + 1;
    }

    requestAnimationFrame(() => {
      this.drawFrequenceAudio();
    });
  }

  backToBeginning(){
    this.player.currentTime = 0;
    this.player.pause();
    this.shadowRoot.querySelector("#play").src="/assets/imgs/play-solid.png";
  }

  listenerSlider(){
    this.shadowRoot.querySelector("#slider60").oninput = (event) => {
      this.setGainOfSlider(60,event.target.value)
    }


  }

  setGainOfSlider(key,value){
    var val = parseFloat(value);
    this.mapSlider.get(key).gain.value = val;
  }

}
customElements.define("my-player", MyPlayer);