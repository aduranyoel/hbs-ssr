class Node {
    constructor(
        attr = {
            name: null,
            nodeId: null,
            type: null,
            children: null,
            accountId: null,
            courseInfo: null,
            picture: null,
            description: null,
            courseId: null,
            sectionId: null,
            lessonId: null,
            sections: null,
            lessons: null,
            link: null,
            url: null,
            idx: null
        }) {
        for (let attrKey in attr) {
            this[attrKey] = attr[attrKey];
        }
    }
}

module.exports = Node;
