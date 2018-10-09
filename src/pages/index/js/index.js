var video = document.querySelector('.top-video');
var videoBtn = document.querySelector('.video-close-btn');
var videoFont = document.querySelector('.top-video-font');

var videoFontTime = 4;
document.documentElement.style.setProperty('--video-font-time', `${videoFontTime}s`);

video.addEventListener("transitionend", function(event) {
    video.classList.add('d-none');
  }, false);
video.addEventListener('playing',function(){
    videoFont.classList.add('top-video-font-opacity-show');
    //视频已经开始播放了
    var hideTime = 4*1000;
    var totalTime = 16*1000;
    var offsetTime = totalTime - hideTime;
    window.setTimeout(()=>{
        video.classList.add('video-hide');
        videoBtn.classList.add('d-none');
    },offsetTime);
    window.setTimeout(()=>{
        videoFont.classList.remove('top-video-font-opacity-show');
    },totalTime - videoFontTime * 1000);
});
videoBtn.addEventListener('click',()=>{
        video.classList.add('d-none');
        videoBtn.classList.add('d-none');
        videoFont.classList.add('d-none');
});