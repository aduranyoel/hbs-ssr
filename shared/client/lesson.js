import {On} from "./utils";
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const goTop = document.getElementById('goTop');
const spinner = document.querySelector('.loader');
const accordionCourse = document.getElementById('accordionCourse');
const videoContent = document.querySelector('.video-content');
let player;

window.onload = () => {
    putEvents();
    initFirstLesson();
};

function putEvents() {
    goTop.addEventListener('click', goTopHandle);
    window.addEventListener('scroll', onScroll);
    On(accordionCourse, 'click', '.accordion-body ul li span[data-lessonId]', setActive);
    On(videoContent, 'click', '#actionPrevious', handleActionPrevious);
    On(videoContent, 'click', '#actionNext', handleActionNext);
}

function switchLoader(active) {
    spinner.style.display = active ? null : 'none';
    active && videoContent.classList.add('loading');
    !active && videoContent.classList.remove('loading');
    if (active && player) {
        player.stop();
    }
}

function onScroll() {
    if (window.scrollY > 550) {
        if (!goTop.classList.contains('show')) goTop.classList.add('show');
    } else {
        goTop.classList.remove('show');
    }
}

function goTopHandle(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
}

async function getEmbed(accountId, courseId, sectionId, lessonId) {
    try {
        const req = await fetch(`/api/embed?accountId=${accountId}&courseId=${courseId}&sectionId=${sectionId}&lessonId=${lessonId}`);
        const {response} = await req.json();
        return response;
    } catch (e) {
        return null;
    }
}

function setCurrentLesson(accountId, courseId, sectionId, lessonId) {
    const controls = `
<div class="plyr__controls">
    <button class="plyr__controls__item plyr__control" type="button" data-plyr="play" aria-label="Play">
        <svg class="icon--pressed" aria-hidden="true" focusable="false">
            <use xlink:href="#plyr-pause"></use>
        </svg>
        <svg class="icon--not-pressed" aria-hidden="true" focusable="false">
            <use xlink:href="#plyr-play"></use>
        </svg>
        <span class="label--pressed plyr__tooltip">Pause</span>
        <span class="label--not-pressed plyr__tooltip">Play</span>
    </button>
    <button id="actionPrevious" class="plyr__controls__item plyr__control" type="button" aria-label="Previous">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="step-backward" class="svg-inline--fa fa-step-backward fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"></path></svg>
        <span class="label--not-pressed plyr__tooltip">Previous</span>
    </button>
    <button id="actionNext" class="plyr__controls__item plyr__control" type="button" aria-label="Next">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="step-forward" class="svg-inline--fa fa-step-forward fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"></path></svg>
        <span class="label--not-pressed plyr__tooltip">Next</span>
    </button>
    <div class="plyr__controls__item plyr__progress__container">
        <div class="plyr__progress">
            <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" autocomplete="off"
                   role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0"
                   id="plyr-seek-4242" aria-valuetext="00:00 of 00:00" style="--value:0%;" seek-value="0">
            <progress class="plyr__progress__buffer" min="0" max="100" value="0" role="progressbar" aria-hidden="true">%
                buffered
            </progress>
            <span class="plyr__tooltip" hidden="" style="left: 0%;">00:00</span>
            <div class="plyr__preview-thumb" style="left: -43.5px;">
                <div class="plyr__preview-thumb__image-container" style="height: 115px; width: 204px;">
                    <img src="https://cdn.plyr.io/static/demo/thumbs/100p-00001.jpg" data-index="0"
                         data-filename="100p-00001.jpg" style="height: 805px; width: 1432.9px; left: 0px; top: 0px;">
                </div>
                <div class="plyr__preview-thumb__time-container"><span>00:00</span></div>
            </div>
        </div>
    </div>
    <div class="plyr__controls__item plyr__time--current plyr__time" aria-label="Current time">0</div>
    <div class="plyr__controls__item plyr__volume">
        <button type="button" class="plyr__control" data-plyr="mute">
            <svg class="icon--pressed" aria-hidden="true" focusable="false">
                <use xlink:href="#plyr-muted"></use>
            </svg>
            <svg class="icon--not-pressed" aria-hidden="true" focusable="false">
                <use xlink:href="#plyr-volume"></use>
            </svg>
            <span class="label--pressed plyr__tooltip">Unmute</span>
            <span class="label--not-pressed plyr__tooltip">Mute</span></button>
        <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" role="slider"
               aria-label="Volume" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" id="plyr-volume-4242"
               aria-valuetext="100.0%" style="--value:100%;"></div>
    <button class="plyr__controls__item plyr__control" type="button" data-plyr="pip">
        <svg aria-hidden="true" focusable="false">
            <use xlink:href="#plyr-pip"></use>
        </svg>
        <span class="plyr__tooltip">PIP</span></button>
    <button class="plyr__controls__item plyr__control" type="button" data-plyr="fullscreen">
        <svg class="icon--pressed" aria-hidden="true" focusable="false">
            <use xlink:href="#plyr-exit-fullscreen"></use>
        </svg>
        <svg class="icon--not-pressed" aria-hidden="true" focusable="false">
            <use xlink:href="#plyr-enter-fullscreen"></use>
        </svg>
        <span class="label--pressed plyr__tooltip">Exit fullscreen</span><span class="label--not-pressed plyr__tooltip">Enter fullscreen</span>
    </button>
</div>
<button type="button" data-plyr="play"
        class="plyr__control plyr__control--overlaid play-center"
        aria-label="Play">
    <svg aria-hidden="true" focusable="false">
        <use xlink:href="#plyr-play"></use>
    </svg>
    <span class="plyr__sr-only">Play</span>
</button>`;

    if (player) player.destroy();
    player = new Plyr('.plyr', {
        controls,
        hideControls: true,
        autoplay: true
    });
    player.source = {
        type: 'video',
        title: 'Lesson',
        sources: [
            {
                src: `/api/stream?accountId=${accountId}&courseId=${courseId}&sectionId=${sectionId}&lessonId=${lessonId}`,
                type: 'video/mp4',
            }
        ]
    };

    player.on("loadeddata", () => {
        if (player.buffered) {
            switchLoader(false);
        }
    });
    player.on("ended", () => {
        handleActionNext();
    })
}

function setActive() {
    const data = {
        accountId: this.getAttribute('data-accountId'),
        courseId: this.getAttribute('data-courseId'),
        sectionId: this.getAttribute('data-sectionId'),
        lessonId: this.getAttribute('data-lessonId'),
        link: this.getAttribute('data-link'),
        idx: this.getAttribute('data-idx'),
        nodeId: this.getAttribute('data-nodeId'),
    };
    const lessonsItems = [].slice.call(document.querySelectorAll('.accordion-body ul li span[data-lessonId]'));
    for (let lessonsItem of lessonsItems) {
        lessonsItem.classList.remove('active');
    }
    this.classList.add('active');
    localStorage.setItem('active', JSON.stringify(data));
    switchLoader(true);
    window.scrollTo(0, 0);
    openSectionAccordion(data.sectionId);
    const {accountId, courseId, sectionId, lessonId} = data;
    setCurrentLesson(accountId, courseId, sectionId, lessonId);
    // if (data.link) {
    //     setCurrentLesson(data.link);
    // } else {
    //     const {accountId, courseId, sectionId, lessonId} = data;
    //     getEmbed(accountId, courseId, sectionId, lessonId).then(url => {
    //         if (url) {
    //             setCurrentLesson(url);
    //             this.setAttribute('data-link', url);
    //         }
    //     })
    // }
}

function initFirstLesson() {
    setActive.call(document.querySelector('.accordion-body ul li span[data-idx]'));
}

function handleActionNext() {
    const active = JSON.parse(localStorage.getItem('active'));
    const next = document.querySelector(`.accordion-body ul li span[data-idx="${+active.idx + 1}"]`);
    if (next) setActive.call(next);
}

function handleActionPrevious() {
    const active = JSON.parse(localStorage.getItem('active'));
    const previous = document.querySelector(`.accordion-body ul li span[data-idx="${+active.idx - 1}"]`);
    if (previous) setActive.call(previous);
}

function openSectionAccordion(sectionId) {
    const isShow = [].slice.call(document.querySelectorAll(`.collapse.show[data-sectionId="${sectionId}"]`)).length > 0;
    if (!isShow)
        [].slice.call(document.querySelectorAll(`.collapse[data-sectionId="${sectionId}"]`))
            .map(collapseEl => new bootstrap.Collapse(collapseEl, {parent: accordionCourse}));
}
