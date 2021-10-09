const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist")

const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const music = document.querySelector("audio");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");

const prevStep = document.getElementById("prev-step");
const nextStep = document.getElementById("next-step");
const surahOrder = document.getElementById("order-num");

const nameOfSurah = document.getElementById("my-select");


let order = 1;

const getCoran = async (number) => {
  const apiUrl = `https://api.quran.sutanlab.id/surah/${number}`;
  const apiUrl2 = "https://api.quran.sutanlab.id/surah"
  try {
    // Verses fetch
    const response = await fetch(apiUrl);
    const data = await response.json();
    const surah = data.data;
    let verses = surah.verses;
    // Surat Fetch
    const response2 = await fetch(apiUrl2);
    const data2 = await response2.json();
    const suratList = data2.data;
    // generate options
    suratList.forEach(l => {
      let opt = document.createElement('option');
      opt.innerHTML =  l.number + ' ' + l.name.short;
      opt.setAttribute("value",l.number)
      nameOfSurah.appendChild(opt);
    });
   
    // Update DOM
    const loadSong = (aya) => {
      title.textContent = surah.name.long;
      artist.textContent = aya.text.arab;
      music.src = aya.audio.primary;
      surahOrder.textContent = surah.number;
    }

    // Current Aya
    let ayaIndex = 0;

    // Next Aya
    const nextAya = () => {
      ayaIndex++;
      if (ayaIndex > verses.length -1){
        ayaIndex = 0;
      }
      loadSong(verses[ayaIndex]);
      playSong()  
    }

    // Previous Aya
    const prevAya = () => {
      ayaIndex--;
      if (ayaIndex < 0) {
        ayaIndex = verses.length - 1
      }
      loadSong(verses[ayaIndex]);
      playSong()
    }

    // On Load -Select Surah
    loadSong(verses[ayaIndex]);

        // Update Progress Bar & Time
    const updateProgressBar = (event) => {
      if (isPlaying) {
        const { duration, currentTime } = event.srcElement;
        // Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        // Calculate display for duration
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10){
          durationSeconds = `0${durationSeconds}`
        }    
        // Delay switching duration Element to avoid NaN
        if (durationSeconds) {
          durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        // Calculate display for currentTime
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10){
          currentSeconds = `0${currentSeconds}`
        }
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
      }
    }

    // Set Progress Bar 
    const setProgressBar = (event) => {
      // const width = this.clientWidth;
      const width = event.srcElement.clientWidth
      const clickX = event.offsetX;
      const { duration } = music;
      music.currentTime = (clickX / width) * duration;
    }

    // Event Listeners
    nextBtn.addEventListener("click", nextAya);
    prevBtn.addEventListener("click", prevAya);
    music.addEventListener("ended", nextAya);
    music.addEventListener("timeupdate", updateProgressBar);
    progressContainer.addEventListener("click", setProgressBar);

    nextStep.addEventListener("click", nextSurah)
    prevStep.addEventListener("click", prevSurah)    

} catch (error) {
        console.log(`Whoop, ${error}`);
  }
}

// Check if Playing
let isPlaying = false;

//  Play
const playSong = () => {
  isPlaying = true;
  playBtn.classList.replace("fa-play-circle", "fa-pause-circle")
  playBtn.setAttribute("title","Pause")
  music.play();
}

// Pause
const pauseSong = () => {
  isPlaying = false;
  playBtn.classList.replace("fa-pause-circle", "fa-play-circle")
  playBtn.setAttribute("title","Play")
  music.pause();
}

// Play or Pause Event Listener 
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()))

const nextSurah =  () => {
  order++
  if (order > 114){
    order = 0
  }
  console.log(`Number ${order}`);
  getCoran(order)
  pauseSong()
  
}

const prevSurah = () => {
  order--
  if (order < 1) {
    order = 114
  } 
  getCoran(order)
  
}

  // Select the sourat and take value    
  const changeFunc = () => {      
    const surahValue = nameOfSurah.value;
    getCoran(surahValue)
    pauseSong()
  }
  // Event Listener  changeFunc
  nameOfSurah.addEventListener("change", changeFunc);

getCoran(order);
