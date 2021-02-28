export function CourseCard({name, nodeId, picture, description, url}) {
    const template = `
    <a class="my-card" href="/course/${url}">
    <div class="my-card-header">
    ${
        picture
            ? `<img src="data:image/jpg;base64, ${picture}" alt=${name}/>`
            : `<img src="/img/camera-solid.svg" alt=${name}/>`
    }
    </div>
    <div class="my-card-body">
        <h2 class="title">${name}</h2>
    <div class="subtitle"><p>${description}</p></div>
    </div>
    </a>
`;
    const element = document.createElement('div');
    element.setAttribute('class', 'col-xl-3 col-lg-4 col-md-6 d-flex align-items-stretch');
    element.innerHTML = template;
    return element;
}
