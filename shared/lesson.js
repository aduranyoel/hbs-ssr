import {useQuery} from "./utils";

const goTop = document.getElementById('goTop');
const iframe = document.querySelector('.video-content iframe');
const spinner = document.querySelector('.loader');

const query = useQuery();
const coursePath = query.get('a');
const [accountId, courseId] = coursePath?.split('/');

window.onload = () => {
    putEvents();
    putVideo();

};

function putEvents() {
    goTop.addEventListener('click', goTopHandle);
    window.addEventListener('scroll', onScroll);
}

function switchLoader(active) {
    spinner.style.display = active ? null : 'none';
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

async function getIndex() {
    try {
        const req = await fetch(`/api/courses/${accountId}/${courseId}`);
        const {response} = await req.json();
        return response;
    } catch (e) {
        return null;
    }
}

async function getEmbed() {
    try {
        const req = await fetch(`/api/embed?path=${coursePath}`);
        const {response} = await req.json();
        return response;
    } catch (e) {
        return null;
    }
}

function putVideo() {
    getEmbed().then(url => {
        if (url) {
            const element = document.createElement('iframe');
            element.src = url;
            element.width = '100%';
            element.height = '100%';
            element.allowFullscreen = true;
            element.addEventListener('load', () => switchLoader(false));
            iframe.replaceWith(element);
        }
    })
}

const getNodePath = nodeId => coursePath.slice().split('/').slice(0, -2).concat(nodeId).join('/');

function putIndex() {
    getIndex().then(index => {
        if (index) {

        }
    })
}
