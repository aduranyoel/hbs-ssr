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

/***/ "./shared/lesson.js":
/*!**************************!*\
  !*** ./shared/lesson.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./shared/utils.js\");\n\r\n\r\nconst goTop = document.getElementById('goTop');\r\nconst iframe = document.querySelector('.video-content iframe');\r\nconst spinner = document.querySelector('.loader');\r\n\r\nconst query = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.useQuery)();\r\nconst coursePath = query.get('a');\r\nconst [accountId, courseId] = coursePath?.split('/');\r\n\r\nwindow.onload = () => {\r\n    putEvents();\r\n    putVideo();\r\n\r\n};\r\n\r\nfunction putEvents() {\r\n    goTop.addEventListener('click', goTopHandle);\r\n    window.addEventListener('scroll', onScroll);\r\n}\r\n\r\nfunction switchLoader(active) {\r\n    spinner.style.display = active ? null : 'none';\r\n}\r\n\r\nfunction onScroll() {\r\n    if (window.scrollY > 550) {\r\n        if (!goTop.classList.contains('show')) goTop.classList.add('show');\r\n    } else {\r\n        goTop.classList.remove('show');\r\n    }\r\n}\r\n\r\nfunction goTopHandle(e) {\r\n    e.preventDefault();\r\n    window.scrollTo(0, 0);\r\n}\r\n\r\nasync function getIndex() {\r\n    try {\r\n        const req = await fetch(`/api/courses/${accountId}/${courseId}`);\r\n        const {response} = await req.json();\r\n        return response;\r\n    } catch (e) {\r\n        return null;\r\n    }\r\n}\r\n\r\nasync function getEmbed() {\r\n    try {\r\n        const req = await fetch(`/api/embed?path=${coursePath}`);\r\n        const {response} = await req.json();\r\n        return response;\r\n    } catch (e) {\r\n        return null;\r\n    }\r\n}\r\n\r\nfunction putVideo() {\r\n    getEmbed().then(url => {\r\n        if (url) {\r\n            const element = document.createElement('iframe');\r\n            element.src = url;\r\n            element.width = '100%';\r\n            element.height = '100%';\r\n            element.allowFullscreen = true;\r\n            element.addEventListener('load', () => switchLoader(false));\r\n            iframe.replaceWith(element);\r\n        }\r\n    })\r\n}\r\n\r\nconst getNodePath = nodeId => coursePath.slice().split('/').slice(0, -2).concat(nodeId).join('/');\r\n\r\nfunction putIndex() {\r\n    getIndex().then(index => {\r\n        if (index) {\r\n\r\n        }\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack://site/./shared/lesson.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./shared/lesson.js");
/******/ 	
/******/ })()
;