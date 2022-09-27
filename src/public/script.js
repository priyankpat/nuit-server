let videoPlayer;
let videosList = [];
const apiURL = "http://localhost:3000/list-videos";
let currentVideo = null;

const getVideosAPI = (url, cb) => {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      cb(xmlHttp.responseText);
  };
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
};

const randomVideo = () => {
  const videosExcluded = currentVideo
    ? videosList.filter((v) => {
        return v.id !== currentVideo?.id;
      })
    : videosList;
  const random = Math.floor(Math.random() * videosExcluded.length);
  const randVideo = videosExcluded[random];
  return randVideo;
};

const playVideo = (name) => {
  console.log(name);
  if (name && name.id !== null) {
    videoPlayer.pause();
    if (videoPlayer.firstElementChild) {
      videoPlayer.removeChild(videoPlayer.firstElementChild);
    }

    const playerSource = document.createElement("source");
    playerSource.setAttribute("src", `/videos/${name.file}`);
    playerSource.setAttribute("type", name.type);
    videoPlayer.appendChild(playerSource);

    videoPlayer.load();
    videoPlayer.play();
  }
};

window.onload = () => {
  videoPlayer = document.getElementById("player");
  const socket = io();

  getVideosAPI(apiURL, (videos) => {
    if (videos) {
      videosList = JSON.parse(videos);

      setTimeout(() => {
        let vid = randomVideo();
        console.log(vid);
        playVideo(vid);
        currentVideo = vid;
      }, 800);
    }
  });

  videoPlayer.addEventListener("ended", function (e) {
    let vid = randomVideo();
    playVideo(vid);
    currentVideo = vid;
  });

  socket.on("ping", function (msg) {
    console.log('detected ping');
    
    let vid = randomVideo();
    playVideo(vid);
    currentVideo = vid;
  });
};
