var video = document.querySelector('.top-video');
var videoBtn = document.querySelector('.video-close-btn');
var videoFont = document.querySelector('.top-video-font');
var videoFontEnd = document.querySelector('.top-video-font-end');
var videoMask = document.querySelector('.video-mask');

var videoFontTime = 4;
document.documentElement.style.setProperty('--video-font-time', `${videoFontTime}s`);

video.addEventListener("transitionend", function (event) {
    video.classList.add('d-none');
    videoMask.classList.add('d-none');
}, false);
video.addEventListener('playing', function () {
    videoFont.classList.add('top-video-font-opacity-show');
    //视频已经开始播放了
    var hideTime = 4 * 1000;
    var totalTime = 16 * 1000;
    var offsetTime = totalTime - hideTime;
    window.setTimeout(() => {
        video.classList.add('video-hide');
        videoMask.classList.add('video-hide');
        videoBtn.classList.add('d-none');
    }, offsetTime);

    var stayTime = 0.5;
    window.setTimeout(() => {
        // videoFont.classList.remove('top-video-font-opacity-show');
        window.setTimeout(() => {
            videoFontEnd.classList.add('top-video-font-end-opacity-show');
        }, (videoFontTime - 3.5) * 1000)
        videoFont.style.opacity = 0;
    }, (videoFontTime + stayTime) * 1000);

    //结尾文字的消失
    window.setTimeout(() => {
        videoFontEnd.style.opacity = 0;
    }, (totalTime - 4 * 1000));
    // window.setTimeout(()=>{
    //     videoFont.classList.remove('top-video-font-opacity-show');
    // },( videoFontTime*2 + stayTime  ) * 1000);

    // window.setTimeout(()=>{
    //     videoFontEnd.classList.remove('top-video-font-end-opacity-show');
    // },( videoFontTime*2 + stayTime*2) * 1000);
});
videoBtn.addEventListener('click', () => {
    video.classList.add('d-none');
    videoBtn.classList.add('d-none');
    videoFont.classList.add('d-none');
});
document.querySelector('.top-nav-item').addEventListener('click', function (e) {
    e.preventDefault();
    // console.log(.is('a'));
    if (!$(e.target).is('.item-detail'))
        return
    // window.setTimeout(function () {
    //     $(e.target).siblings().removeClass('active');
    //     $(e.target).addClass('active');
    // }, 0);
    var target = document.querySelector(e.target.dataset.target);
    var headerHeight = document.querySelector(".nav-header").offsetHeight;
    var scroll = window.scrollY || document.documentElement.scrollTop;
    console.log(headerHeight, scroll);
    var location = target.getBoundingClientRect().top + scroll - headerHeight;
    $("html, body").animate({
        scrollTop: location,
    }, 500);
});
// document.query
$('body').scrollspy({ target: '#top-nav-item-list', offset: 200 })
// $('body').scrollspy({ target: '#navbar-example' })