import {setCourses} from "./utils";
import {Paginator} from "./components/paginator.component";

const searchForm = document.getElementById('searchForm');

window.onload = async () => {

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const value = e.target[0].value.trim().toLowerCase();
        setCourses(window.courses.filter(c => c.name.toLowerCase().indexOf(value) > -1), {page: 1});
    });

    try {
        const request = await fetch('/api/courses');
        const {response} = await request.json();
        window.courses = response;
        setCourses(response, {page: 1});
        document.getElementById('paginator').replaceWith(Paginator(response));
    } catch (e) {
        //TODO put error picture
        console.error(e);
    }

};
