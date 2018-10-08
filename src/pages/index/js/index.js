var video = document.querySelector('.top-video');
var videoBtn = document.querySelector('.video-close-btn');
video.addEventListener("transitionend", function(event) {
    video.classList.add('d-none');
  }, false);
video.addEventListener('playing',function(){
    //视频已经开始播放了
    var hideTime = 4*1000;
    var totalTime = 16*1000;
    var offsetTime = totalTime - hideTime;
    window.setTimeout(()=>{
        video.classList.add('video-hide');
        videoBtn.classList.add('d-none');
    },offsetTime);
});
videoBtn.addEventListener('click',()=>{
        video.classList.add('d-none');
        videoBtn.classList.add('d-none');
});