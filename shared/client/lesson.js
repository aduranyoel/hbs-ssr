import {On} from "./utils";

const goTop = document.getElementById('goTop');
let iframe = document.querySelector('.video-content iframe');
const spinner = document.querySelector('.loader');
const accordionCourse = document.getElementById('accordionCourse');
const actionsContainer = document.querySelector('.video-content .actions');
const actionNext = document.getElementById('actionNext');
const actionPrevious = document.getElementById('actionPrevious');

window.onload = () => {
    putEvents();
    initFirstLesson();
};

function putEvents() {
    goTop.addEventListener('click', goTopHandle);
    window.addEventListener('scroll', onScroll);
    On(accordionCourse, 'click', '.accordion-body ul li span[data-lessonId]', setActive);
    actionNext.addEventListener('click', handleActionNext);
    actionPrevious.addEventListener('click', handleActionPrevious);
}

function switchLoader(active) {
    spinner.style.display = active ? null : 'none';
    iframe.style.opacity = active ? '0' : '1';
    active && actionsContainer.classList.add('loading');
    !active && actionsContainer.classList.remove('loading');
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

function setCurrentLesson(url) {
    const element = document.createElement('iframe');
    element.src = url;
    element.width = '100%';
    element.height = '100%';
    element.allowFullscreen = true;
    element.addEventListener('load', () => switchLoader(false));
    iframe.replaceWith(element);
    iframe = element;
}

function setActive() {
    const data = {
        accountId: this.getAttribute('data-accountId'),
        courseId: this.getAttribute('data-courseId'),
        sectionId: this.getAttribute('data-sectionId'),
        lessonId: this.getAttribute('data-lessonId'),
        link: this.getAttribute('data-link'),
    };
    const lessonsItems = [].slice.call(document.querySelectorAll('.accordion-body ul li span[data-lessonId]'));
    for (let lessonsItem of lessonsItems) {
        lessonsItem.classList.remove('active');
    }
    this.classList.add('active');
    localStorage.setItem('active', JSON.stringify(data));
    switchLoader(true);
    window.scrollTo(0, 0);
    if (data.link) {
        setCurrentLesson(data.link);
    } else {
        const {accountId, courseId, sectionId, lessonId} = data;
        getEmbed(accountId, courseId, sectionId, lessonId).then(url => {
            if (url) {
                setCurrentLesson(url);
                this.setAttribute('data-link', url);
            }
        })
    }
}

function initFirstLesson() {
    setActive.call(document.querySelector('.accordion-body ul li span[data-lessonId]'));
}

function handleActionNext() {
    const active = JSON.parse(localStorage.getItem('active'));
    const next = document.querySelector(`.accordion-body ul li span[data-lessonId="${active.lessonId}"]`)
        ?.parentNode?.parentNode?.nextElementSibling?.querySelector('span');
    if (next) setActive.call(next);
}

function handleActionPrevious() {
    const active = JSON.parse(localStorage.getItem('active'));
    const previous = document.querySelector(`.accordion-body ul li span[data-lessonId="${active.lessonId}"]`)
        ?.parentNode?.parentNode?.previousElementSibling?.querySelector('span');
    if (previous) setActive.call(previous);
}

