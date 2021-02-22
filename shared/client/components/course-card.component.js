export function CourseCard({name, nodeId, picture, description, courseId}) {

    const openCourse = async() => {
        if (!nodeId) return null;
        window.location.href = `/course/${courseId}`;
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
