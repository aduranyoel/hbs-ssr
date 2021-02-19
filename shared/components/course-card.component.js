import {childrenSorted} from "../utils";

export function CourseCard({name, nodeId, children, accountId, courseInfo}) {
    const {picture, description} = courseInfo;

    const firstLesson = (nodes, path = '') => {
        if (Array.isArray(nodes) && nodes.length) {
            const first = nodes[0];
            path += `/${first.nodeId}`;
            if (Array.isArray(first.children)) {
                return firstLesson(first.children, path)
            } else {
                return path;
            }
        }
        return '';
    };

    const sorted = childrenSorted(children);

    const firstFilePath = `${accountId}/${nodeId}${firstLesson(sorted)}`;

    const openCourse = async() => {
        if (!nodeId) return null;
        window.location.href = `/lesson?a=${firstFilePath}`;
    };

    const template = `
    <div class="my-card">
    <div class="my-card-header">
    ${
        picture
            ? `<img src="data:image/jpg;base64, ${picture}" alt=${name}/>`
            : `<img src="/img/camera-solid.svg" alt=${name}/>`
    }
    </div>
    <div class="my-card-body">
        <div class="title">${name}</div>
    <div class="subtitle">${description}</div>
    </div>
    </div>
`;
    const element = document.createElement('div');
    element.setAttribute('class', 'col-xl-3 col-lg-4 col-md-6 d-flex align-items-stretch');
    element.onclick = openCourse;
    element.innerHTML = template;
    return element;
}
