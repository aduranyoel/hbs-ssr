import {On, range, setCourses} from "../utils";

export function Paginator(data) {
    const element = document.createElement('div');
    element.classList.add('blog');

    const PAGE_LENGTH = 8;
    let {courses, pages, active} = getState(data);

    function getState(courses, {page = 1, length = PAGE_LENGTH} = {}) {
        return {
            active: page,
            courses,
            pages: range(1, Math.ceil(courses.length / length))
        }
    }

    function render(data, {page}) {
        const state = getState(data, {page});
        courses = state.courses;
        pages = state.pages;
        active = state.active;
        element.innerHTML = template();
    }

    function navigate(e) {
        e.preventDefault();
        let page = +this.getAttribute('data-go');
        if (page === active) return;
        window.scrollTo(0, 0);
        active = page;
        setCourses(courses, {page});
    }

    setCourses.subscribe(render);
    On(element, 'click', 'a[data-go]', navigate);

    const template = () => `
        <div class="blog-pagination" style="display: ${pages.length < 2 ? 'none' : 'block'}">
            <ul class="justify-content-center">
                <li class="${active === 1 ? "disabled" : ''}">
                    <a data-go="${active - 1}" href="/" class="navigate">${'<'}</a>
                </li>

                    ${
        pages.map((page, idx) => {
            const isActive = idx + 1 === active;
            return `
                        <li class=${isActive ? "active" : ""}>
                            <a data-go="${page}" href="/">${page}</a>
                        </li>
                    `
        }).join('')
    }

                <li class="${active === pages.length ? "disabled" : ''}">
                    <a data-go="${active + 1}" href="/" class="navigate">${'>'}</a>
                </li>
            </ul>
        </div>
    `;

    element.innerHTML = template();
    return element;
}
