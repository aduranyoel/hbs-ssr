import {CourseCard} from "./components/course-card.component";
import Node from "../../model/node";
import {DEFAULT_PAGE_LENGTH} from "./main-section";

export function sortNodesByName(a, b) {
    const
        A = a.name.split('.')[0].padStart(4, '0'),
        B = b.name.split('.')[0].padStart(4, '0');
    return A > B ? 1 : -1;
}

export const childrenSorted = (nodes) => {
    return nodes
        .filter(n => n.name !== 'data.json')
        .sort(sortNodesByName)
        .map(n => {
            if (Array.isArray(n.children)) n.children = childrenSorted(n.children);
            return n;
        })
};

export function paginate(data, {page, length = 8}) {
    const start = (page - 1) * length;
    return data.slice().slice(start, start + length);
}

export function range(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
}

export function On(element = document, eventName, selector, handler) {

    (function (E, d, w) {
        if (!E.composedPath) {
            E.composedPath = function () {
                if (this.path) {
                    return this.path;
                }
                var target = this.target;

                this.path = [];
                while (target.parentNode !== null) {
                    this.path.push(target);
                    target = target.parentNode;
                }
                this.path.push(d, w);
                return this.path;
            };
        }
    })(Event.prototype, document, window);

    element.addEventListener(
        eventName,
        function (event) {
            let elements = document.querySelectorAll(selector);
            let path = event.composedPath();
            for (let j = 0, l = path.length; j < l; j++) {
                for (let i = 0, len = elements.length; i < len; i++) {
                    if (path[j] === elements[i]) {
                        handler.call(elements[i], event);
                    }
                }
            }
        },
        true
    );
}

export const setCourses = (function () {
    let cards = document.getElementById('cards');
    let subscribers = [];

    function subject(courses, {page, length = DEFAULT_PAGE_LENGTH}) {
        const paginated = paginate(courses, {page, length});
        const row = document.createElement('div');
        row.classList.add('row');
        for (let child of paginated) {
            row.appendChild(CourseCard(new Node(child)));
        }
        if (paginated && !paginated.length) {
            row.innerHTML = `<img class="empty" src="/img/undraw_empty_xct9.svg" alt="empty" width="16rem"/>`;
        }
        cards.replaceWith(row);
        cards = row;
        notify(courses, {page, length});
    }

    subject.subscribe = subscriber => {
        subscribers.push(subscriber);
    };

    function notify(courses, {page, length}) {
        for (let subscriber of subscribers) {
            subscriber.call(this, courses, {page, length});
        }
    }

    return subject;

})();

export function useQuery() {
    return new URLSearchParams(location.search);
}
