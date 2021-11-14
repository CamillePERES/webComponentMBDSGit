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

  #volumeMeter{
    border:1px solid black;
  }

  #audioFreq{
    border:1px solid black;
  }

  button {
    transition-duration: 0.4s;
    background-color: #dff2ff;
    border: 1px solid black; 
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
    background-color:#dff2ff;
    border: 1px solid black;
  }

  .mainButton{
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
  }

  .muteButton{
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
  }

  .sliderContainer{
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    background-color:#dff2ff;
    border: 1px solid black;
  }

  #loop{
    margin-left: 10px;
  }

  .sl60{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
  }

  .sl170{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .sl350{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .sl1000{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .sl3500{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .sl10k{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .slider{
    display:flex;
    flex-direction:row;
  }

  .soundButton{
    display:flex;
    flex-direction:row;
  }

  .textBass{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
  }

  .textPresence{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .textTreble{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .textMid{
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
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
        <img id ="sound" src="/assets/imgs/volume-up-solid.png"></img>
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
    <canvas id="volumeMeter" width="51" height="150px"></canvas>
  </div>
  
  <canvas id="audioFreq" width="400" height="200"></canvas>
  
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

  <div class="slider">

    <div class="sl60">
      <webaudio-knob id="slider60"  
      src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
      value=0 min=-15 max=15 step=1
      tooltip="Value: %s"
      sprites="200"
      >
      </webaudio-knob>

      <span>FREQ60</span>
    </div>

    <div class="sl170">
      <webaudio-knob id="slider170"  
      src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
      value=0 min=-15 max=15 step=1
      tooltip="Value: %s"
      sprites="200"
      >
      </webaudio-knob>
      
      <span>FREQ170</span>
    </div>

    <div class="sl350">
      <webaudio-knob id="slider350"  
      src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
      value=0 min=-15 max=15 step=1
      tooltip="Value: %s"
      sprites="200"
      >
      </webaudio-knob>

      <span>FREQ350</span>
    </div>

    <div class="sl1000">
      <webaudio-knob id="slider1000"  
      src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
      value=0 min=-15 max=15 step=1
      tooltip="Value: %s"
      sprites="200"
      >
      </webaudio-knob>

      <span>FREQ1000</span>
    </div>
    
    <div class="sl3500">
      <webaudio-knob id="slider3500"  
      src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
      value=0 min=-15 max=15 step=1
      tooltip="Value: %s"
      sprites="200"
      >
      </webaudio-knob>

      <span>FREQ3500</span>
    </div>

    <div class="sl10k">
      <webaudio-knob id="slider10k"  
      src="/assets/imgs/PC3_EnvFader_03_Blue.png" 
      value=0 min=-15 max=15 step=1
      tooltip="Value: %s"
      sprites="200"
      >
      </webaudio-knob>

      <span>FREQ10000</span>
    </div>
  </div>

  <div class="soundButton">
    <div class="textBass">
      <webaudio-knob id="bass" 
      src="/assets/imgs/KNB_metal_indigo_L.png" 
      value="5" 
      min="0" 
      max="10" 
      step="0.1" 
      diameter="69"
      tooltip="Bass: %s">
      </webaudio-knob>

      <span>Bass</span>
    </div>
      
    <div class="textPresence">
      <webaudio-knob id="presence" 
      src="/assets/imgs/KNB_metal_indigo_L.png" 
      value="5" 
      min="0" 
      max="10" 
      step="0.1" 
      diameter="69"
      tooltip="Presence: %s">
      </webaudio-knob>

      <span>Presence</span>
    </div>

    <div class="textTreble">
      <webaudio-knob id="treble" 
      src="/assets/imgs/KNB_metal_indigo_L.png" 
      value="5" 
      min="0" 
      max="10" 
      step="0.1" 
      diameter="69"
      tooltip="Treble: %s">
      </webaudio-knob>

      <span>Treble</span>
    </div>

    <div class="textMid">
      <webaudio-knob id="mid" 
      src="/assets/imgs/KNB_metal_indigo_L.png" 
      value="5" 
      min="0" 
      max="10" 
      step="0.1" 
      diameter="69"
      tooltip="Mid: %s">
      </webaudio-knob>

      <span>Mid</span>
    </div>
  </div>

</div>

 
`;

class MyPlayer extends HTMLElement {

  mapSlider = new Map();
  bassFilter;
  trebleFilter;
  presenceFilter;
  midFilter;
  mapButton = new Map();
  gradient;

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
    this.slider170 = this.shadowRoot.querySelector("#slider170");
    this.slider350 = this.shadowRoot.querySelector("#slider350");
    this.slider1000 = this.shadowRoot.querySelector("#slider1000");
    this.slider3500 = this.shadowRoot.querySelector("#slider3500");
    this.slider10k = this.shadowRoot.querySelector("#slider10k");

    this.bassKnob = this.shadowRoot.querySelector("#bass");
    this.trebleKnob = this.shadowRoot.querySelector("#treble");
    this.midbKnob = this.shadowRoot.querySelector("#mid");
    this.presenceKnob = this.shadowRoot.querySelector("#presence");

    this.audioCanvas = this.shadowRoot.querySelector("#audioGraph");
    this.audioCanvasContext = this.audioCanvas.getContext("2d");

    this.freqCanvas = this.shadowRoot.querySelector("#audioFreq");
    this.freqCanvasContext = this.freqCanvas.getContext("2d");

    this.volumeCanvas = this.shadowRoot.querySelector("#volumeMeter");
    this.volumeCanvasContext = this.volumeCanvas.getContext("2d");

    this.mute = this.shadowRoot.querySelector("#mute");

    this.gradient = this.volumeCanvasContext.createLinearGradient(0,0,0, this.volumeCanvas.height);
    this.gradient.addColorStop(1,'#00FFFF');
    this.gradient.addColorStop(0.75,'#40E0D0');
    this.gradient.addColorStop(0.25,'#48D1CC');
    this.gradient.addColorStop(0,'#00CED1');

    this.defineListeners();
    this.listenerSlider();
    this.listenerButton();
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
          this.drawVolume();
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
      this.shadowRoot.querySelector("#sound").src="/assets/imgs/volume-up-solid.png";
    }
    else{
      this.shadowRoot.querySelector("#sound").src = "/assets/imgs/volume-mute-solid.png";
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
    this.stereoPanner = this.audioContext.createStereoPanner();
    source.connect(this.stereoPanner);

    this.buildSlider(this.audioContext);
    this.buildButton(this.audioContext);

    this.analyser.fftSize = 2048;
    this.sizeBuffer = this.analyser.frequencyBinCount;
    this.dataTable = new Uint8Array(this.sizeBuffer);


    let currentNode = source;
    for(let button of this.mapButton.values()){
      currentNode.connect(button);
      currentNode=button;
    }
    for(let filter of this.mapSlider.values()){
      currentNode.connect(filter);
      currentNode = filter;
    }
    currentNode.connect(this.stereoPanner);
    this.stereoPanner.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.analyserLeft = this.audioContext.createAnalyser();
    this.analyserLeft.fftSize = 256;
    this.sizeBufferLeft = this.analyserLeft.frequencyBinCount;
    this.dataTableLeft = new Uint8Array(this.sizeBufferLeft);

    this.analyserRight = this.audioContext.createAnalyser();
    this.analyserRight.fftSize = 256;
    this.sizeBufferRight = this.analyserRight.frequencyBinCount;
    this.dataTableRight = new Uint8Array(this.sizeBufferRight);

    this.splitter = this.audioContext.createChannelSplitter();
    this.stereoPanner.connect(this.splitter);
    this.splitter.connect(this.analyserLeft,0,0);
    this.splitter.connect(this.analyserRight,1,0);
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

  buildButton(context){
    this.bassFilter=context.createBiquadFilter();
    this.bassFilter.frequency.value = 100;
    this.bassFilter.type = "lowshelf";
    this.bassFilter.Q.value = 0.7071;
    this.mapButton.set("bass",this.bassFilter);
    console.log(this.bassFilter)

    this.trebleFilter=context.createBiquadFilter();
    this.trebleFilter.frequency.value = 6500;
    this.trebleFilter.type = "highshelf";
    this.trebleFilter.Q.value = 0.7071;
    this.mapButton.set("treble",this.trebleFilter);

    this.presenceFilter=context.createBiquadFilter();
    this.presenceFilter.frequency.value = 3900;
    this.presenceFilter.type = "peaking";
    this.presenceFilter.Q.value = 0.7071;
    this.mapButton.set("presence",this.presenceFilter);

    this.midFilter = context.createBiquadFilter();
    this.midFilter.frequency.value = 1700;
    this.midFilter.type = "peaking";
    this.midFilter.Q.value = 0.7071;
    this.mapButton.set("mid",this.midFilter);
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

  drawVolume(){
    this.volumeCanvasContext.clearRect(0,0,this.volumeCanvas.width,this.volumeCanvas.height)
    this.volumeCanvasContext.save();

    this.volumeCanvasContext.fillStyle=this.gradient;

    this.analyserLeft.getByteFrequencyData(this.dataTableLeft);
    var averageLeft = this.getAverageVolume(this.dataTableLeft);
    const sizeHR = this.volumeCanvas.height < averageLeft ? 0 : this.volumeCanvas.height-averageLeft;
    this.volumeCanvasContext.fillRect(0, sizeHR, 25, this.volumeCanvas.height);

    this.analyserRight.getByteFrequencyData(this.dataTableRight);
    var averageRight = this.getAverageVolume(this.dataTableRight);
    const sizeHL = this.volumeCanvas.height < averageRight ? 0 : this.volumeCanvas.height-averageRight;
    this.volumeCanvasContext.fillRect(26, sizeHL, 25, this.volumeCanvas.height);

    this.volumeCanvasContext.restore();

    requestAnimationFrame(() => {
      this.drawVolume();
    });
  }

  getAverageVolume(array){
    var values = 0;
    var average;
    var length = array.length;

    for (var i = 0; i < length; i++) {
      values += array[i];
    }
    average = values / length;
    return average;
  }

  drawFrequenceAudio(){
    this.freqCanvasContext.clearRect(0, 0, this.freqCanvas.width, this.freqCanvas.height)

    this.analyser.getByteFrequencyData(this.dataTable);

    this.freqCanvasContext.fillStyle = 'rgb(223, 242, 255)';
    this.freqCanvasContext.fillRect(0, 0, this.freqCanvas.width,this.freqCanvas.height);

    let barWidth = this.freqCanvas.width / this.sizeBuffer;
    let barHeigth;
    var x=0;

    let heightScale = this.freqCanvas.height / 128;

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
    this.shadowRoot.querySelector("#slider170").oninput = (event) => {
      this.setGainOfSlider(170,event.target.value)
    }
    this.shadowRoot.querySelector("#slider350").oninput = (event) => {
      this.setGainOfSlider(350,event.target.value)
    }
    this.shadowRoot.querySelector("#slider1000").oninput = (event) => {
      this.setGainOfSlider(1000,event.target.value)
    }
    this.shadowRoot.querySelector("#slider3500").oninput = (event) => {
      this.setGainOfSlider(3500,event.target.value)
    }
    this.shadowRoot.querySelector("#slider10k").oninput = (event) => {
      this.setGainOfSlider(10000,event.target.value)
    }
  }

  listenerButton(){
    this.shadowRoot.querySelector("#bass").oninput = (event) => {
      this.changeBassFilterValue(event.target.value)
    };
    this.shadowRoot.querySelector("#treble").oninput = (event) => {
      this.changeTrebleFilterValue(event.target.value)
    }
    this.shadowRoot.querySelector("#presence").oninput = (event) => {
      this.changePresenceFilterValue(event.target.value)
    }
    this.shadowRoot.querySelector("#mid").oninput = (event) => {
      this.changeMidFilterValue(event.target.value)
    }
  }

  setGainOfSlider(key,value){
    var val = parseFloat(value);
    const filter = this.mapSlider.get(key);
    if(filter !== undefined)
      filter.gain.value = val;
  }

  changeBassFilterValue(sliderVal) {
    var value = parseFloat(sliderVal);
    const bass = this.bassFilter;
    if (bass !== undefined)
      bass.gain.value = (value-10) * 7;
    var knob = this.shadowRoot.querySelector("#bass");
    knob.setValue(parseFloat(sliderVal).toFixed(1), false);
  }

  changeTrebleFilterValue(sliderVal) {
    var value = parseFloat(sliderVal);
    const treble = this.trebleFilter;
    if (treble !== undefined)
      treble.gain.value = (value-10) * 10;
    var knob = this.shadowRoot.querySelector("#treble");
    knob.setValue(parseFloat(sliderVal).toFixed(1), false);
  }

  changePresenceFilterValue(sliderVal) {
    var value = parseFloat(sliderVal);
    const presence = this.presenceFilter;
    if (presence !== undefined)
      presence.gain.value = (value-5) * 2;
    var knob = this.shadowRoot.querySelector("#presence");
    knob.setValue(parseFloat(sliderVal).toFixed(1), false);
  }

  changeMidFilterValue(sliderVal) {
    var value = parseFloat(sliderVal);
    const mid = this.midFilter;
    if (mid !== undefined)
      mid.gain.value = (value-5) * 4;
    var knob = this.shadowRoot.querySelector("#mid");
    knob.setValue(parseFloat(sliderVal).toFixed(1), false);
}

}
customElements.define("my-player", MyPlayer);