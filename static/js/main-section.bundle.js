/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./model/node.js":
/*!***********************!*\
  !*** ./model/node.js ***!
  \***********************/
/***/ ((module) => {

eval("class Node {\r\n    constructor({name, nodeId, type, children, accountId, courseInfo}) {\r\n        this.name = name;\r\n        this.nodeId = nodeId;\r\n        this.type = type;\r\n        this.children = children;\r\n        this.accountId = accountId;\r\n        this.courseInfo = courseInfo;\r\n    }\r\n}\r\n\r\nmodule.exports = Node;\r\n\n\n//# sourceURL=webpack://site/./model/node.js?");

/***/ }),

/***/ "./shared/components/course-card.component.js":
/*!****************************************************!*\
  !*** ./shared/components/course-card.component.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CourseCard\": () => (/* binding */ CourseCard)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./shared/utils.js\");\n\r\n\r\nfunction CourseCard({name, nodeId, children, accountId, courseInfo}) {\r\n    const {picture, description} = courseInfo;\r\n\r\n    const firstLesson = (nodes, path = '') => {\r\n        if (Array.isArray(nodes) && nodes.length) {\r\n            const first = nodes[0];\r\n            path += `/${first.nodeId}`;\r\n            if (Array.isArray(first.children)) {\r\n                return firstLesson(first.children, path)\r\n            } else {\r\n                return path;\r\n            }\r\n        }\r\n        return '';\r\n    };\r\n\r\n    const sorted = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.childrenSorted)(children);\r\n\r\n    const firstFilePath = `${accountId}/${nodeId}${firstLesson(sorted)}`;\r\n\r\n    const openCourse = async() => {\r\n        if (!nodeId) return null;\r\n        window.location.href = `/lesson?a=${firstFilePath}`;\r\n    };\r\n\r\n    const template = `\r\n    <div class=\"my-card\">\r\n    <div class=\"my-card-header\">\r\n    ${\r\n        picture\r\n            ? `<img src=\"data:image/jpg;base64, ${picture}\" alt=${name}/>`\r\n            : `<img src=\"/img/camera-solid.svg\" alt=${name}/>`\r\n    }\r\n    </div>\r\n    <div class=\"my-card-body\">\r\n        <div class=\"title\">${name}</div>\r\n    <div class=\"subtitle\">${description}</div>\r\n    </div>\r\n    </div>\r\n`;\r\n    const element = document.createElement('div');\r\n    element.setAttribute('class', 'col-xl-3 col-lg-4 col-md-6 d-flex align-items-stretch');\r\n    element.onclick = openCourse;\r\n    element.innerHTML = template;\r\n    return element;\r\n}\r\n\n\n//# sourceURL=webpack://site/./shared/components/course-card.component.js?");

/***/ }),

/***/ "./shared/components/paginator.component.js":
/*!**************************************************!*\
  !*** ./shared/components/paginator.component.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Paginator\": () => (/* binding */ Paginator)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./shared/utils.js\");\n\r\n\r\nfunction Paginator(data) {\r\n    const element = document.createElement('div');\r\n    element.classList.add('blog');\r\n\r\n    const PAGE_LENGTH = 8;\r\n    let {courses, pages, active} = getState(data);\r\n\r\n    function getState(courses, {page = 1, length = PAGE_LENGTH} = {}) {\r\n        return {\r\n            active: page,\r\n            courses,\r\n            pages: (0,_utils__WEBPACK_IMPORTED_MODULE_0__.range)(1, Math.ceil(courses.length / length))\r\n        }\r\n    }\r\n\r\n    function render(data, {page}) {\r\n        const state = getState(data, {page});\r\n        courses = state.courses;\r\n        pages = state.pages;\r\n        active = state.active;\r\n        element.innerHTML = template();\r\n    }\r\n\r\n    function navigate(e) {\r\n        e.preventDefault();\r\n        let page = +this.getAttribute('data-go');\r\n        if (page === active) return;\r\n        window.scrollTo(0, 0);\r\n        active = page;\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setCourses)(courses, {page});\r\n    }\r\n\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.setCourses.subscribe(render);\r\n    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.On)(element, 'click', 'a[data-go]', navigate);\r\n\r\n    const template = () => `\r\n        <div class=\"blog-pagination\" style=\"display: ${pages.length < 2 ? 'none' : 'block'}\">\r\n            <ul class=\"justify-content-center\">\r\n                <li class=\"${active === 1 ? \"disabled\" : ''}\">\r\n                    <a data-go=\"${active - 1}\" href=\"/\" class=\"navigate\">${'<'}</a>\r\n                </li>\r\n\r\n                    ${\r\n        pages.map((page, idx) => {\r\n            const isActive = idx + 1 === active;\r\n            return `\r\n                        <li class=${isActive ? \"active\" : \"\"}>\r\n                            <a data-go=\"${page}\" href=\"/\">${page}</a>\r\n                        </li>\r\n                    `\r\n        }).join('')\r\n    }\r\n\r\n                <li class=\"${active === pages.length ? \"disabled\" : ''}\">\r\n                    <a data-go=\"${active + 1}\" href=\"/\" class=\"navigate\">${'>'}</a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    `;\r\n\r\n    element.innerHTML = template();\r\n    return element;\r\n}\r\n\n\n//# sourceURL=webpack://site/./shared/components/paginator.component.js?");

/***/ }),

/***/ "./shared/main-section.js":
/*!********************************!*\
  !*** ./shared/main-section.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./shared/utils.js\");\n/* harmony import */ var _components_paginator_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/paginator.component */ \"./shared/components/paginator.component.js\");\n\r\n\r\n\r\nconst searchForm = document.getElementById('searchForm');\r\n\r\nwindow.onload = async () => {\r\n\r\n    searchForm.addEventListener('submit', function (e) {\r\n        e.preventDefault();\r\n        const value = e.target[0].value.trim().toLowerCase();\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setCourses)(window.courses.filter(c => c.name.toLowerCase().indexOf(value) > -1), {page: 1});\r\n    });\r\n\r\n    try {\r\n        const request = await fetch('/api/courses');\r\n        const {response} = await request.json();\r\n        window.courses = response;\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setCourses)(response, {page: 1});\r\n        document.getElementById('paginator').replaceWith((0,_components_paginator_component__WEBPACK_IMPORTED_MODULE_1__.Paginator)(response));\r\n    } catch (e) {\r\n        //TODO put error picture\r\n        console.error(e);\r\n    }\r\n\r\n};\r\n\n\n//# sourceURL=webpack://site/./shared/main-section.js?");

/***/ }),

/***/ "./shared/utils.js":
/*!*************************!*\
  !*** ./shared/utils.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sortNodesByName\": () => (/* binding */ sortNodesByName),\n/* harmony export */   \"childrenSorted\": () => (/* binding */ childrenSorted),\n/* harmony export */   \"paginate\": () => (/* binding */ paginate),\n/* harmony export */   \"range\": () => (/* binding */ range),\n/* harmony export */   \"On\": () => (/* binding */ On),\n/* harmony export */   \"setCourses\": () => (/* binding */ setCourses),\n/* harmony export */   \"useQuery\": () => (/* binding */ useQuery)\n/* harmony export */ });\n/* harmony import */ var _components_course_card_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/course-card.component */ \"./shared/components/course-card.component.js\");\n/* harmony import */ var _model_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/node */ \"./model/node.js\");\n/* harmony import */ var _model_node__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_model_node__WEBPACK_IMPORTED_MODULE_1__);\n\r\n\r\n\r\nfunction sortNodesByName(a, b) {\r\n    const\r\n        A = a.name.split('.')[0].padStart(4, '0'),\r\n        B = b.name.split('.')[0].padStart(4, '0');\r\n    return A > B ? 1 : -1;\r\n}\r\n\r\nconst childrenSorted = (nodes) => {\r\n    return nodes\r\n        .filter(n => n.name !== 'data.json')\r\n        .sort(sortNodesByName)\r\n        .map(n => {\r\n            if (Array.isArray(n.children)) n.children = childrenSorted(n.children);\r\n            return n;\r\n        })\r\n};\r\n\r\nfunction paginate(data, {page, length = 8}) {\r\n    const start = (page - 1) * length;\r\n    return data.slice().slice(start, start + length);\r\n}\r\n\r\nfunction range(start, end) {\r\n    const result = [];\r\n    for (let i = start; i <= end; i++) result.push(i);\r\n    return result;\r\n}\r\n\r\nfunction On(element = document, eventName, selector, handler) {\r\n\r\n    (function (E, d, w) {\r\n        if (!E.composedPath) {\r\n            E.composedPath = function () {\r\n                if (this.path) {\r\n                    return this.path;\r\n                }\r\n                var target = this.target;\r\n\r\n                this.path = [];\r\n                while (target.parentNode !== null) {\r\n                    this.path.push(target);\r\n                    target = target.parentNode;\r\n                }\r\n                this.path.push(d, w);\r\n                return this.path;\r\n            };\r\n        }\r\n    })(Event.prototype, document, window);\r\n\r\n    element.addEventListener(\r\n        eventName,\r\n        function (event) {\r\n            let elements = document.querySelectorAll(selector);\r\n            let path = event.composedPath();\r\n            for (let j = 0, l = path.length; j < l; j++) {\r\n                for (let i = 0, len = elements.length; i < len; i++) {\r\n                    if (path[j] === elements[i]) {\r\n                        handler.call(elements[i], event);\r\n                    }\r\n                }\r\n            }\r\n        },\r\n        true\r\n    );\r\n}\r\n\r\nconst setCourses = (function () {\r\n    let cards = document.getElementById('cards');\r\n    let subscribers = [];\r\n\r\n    function subject(courses, {page, length = 8}) {\r\n        const paginated = paginate(courses, {page, length});\r\n        const row = document.createElement('div');\r\n        row.classList.add('row');\r\n        for (let child of paginated) {\r\n            row.appendChild((0,_components_course_card_component__WEBPACK_IMPORTED_MODULE_0__.CourseCard)(new (_model_node__WEBPACK_IMPORTED_MODULE_1___default())(child)));\r\n        }\r\n        cards.replaceWith(row);\r\n        cards = row;\r\n        notify(courses, {page, length});\r\n    }\r\n\r\n    subject.subscribe = subscriber => {\r\n        subscribers.push(subscriber);\r\n    };\r\n\r\n    function notify(courses, {page, length}) {\r\n        for (let subscriber of subscribers) {\r\n            subscriber.call(this, courses, {page, length});\r\n        }\r\n    }\r\n\r\n    return subject;\r\n\r\n})();\r\n\r\nfunction useQuery() {\r\n    return new URLSearchParams(location.search);\r\n}\r\n\n\n//# sourceURL=webpack://site/./shared/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./shared/main-section.js");
/******/ 	
/******/ })()
;