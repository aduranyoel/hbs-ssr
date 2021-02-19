const mega = require('megajs');
const Node = require('../model/node');

const accounts = [
    {
        accountId: 1,
        email: 'beiiakotmghumoqgrh@niwghx.com',
        password: 'Yoel44901',
        recovery: '1rqhvSPmPGSN-40KeWZjBw'
    },
    {
        accountId: 2,
        email: 'vjqpeuizcvbleytvqw@miucce.com',
        password: 'Yoel44901',
        recovery: 'POFbAtEd3QRikCUNPF_vjQ'
    }
];
let interval;

function getAllCourses() {
    return new Promise(resolve => {
        let cache = {};
        let readyAccounts = 0, totalAccounts = accounts.length, readyCourses = 0, totalCourses = 0;
        accounts.forEach(account => {
            const {accountId, ...login} = account;
            new mega.Storage(login, (err, res) => {
                ++readyAccounts;
                const courses = res.root.children.find(n => n.name === 'courses');
                if (courses) {
                    totalCourses += courses.children.length || 0;
                    cache[accountId] = courses;
                    courses.children.forEach((course, index) => {
                        const data = course.children.find(c => c.name === 'data.json');
                        if (data) {
                            data.download((err, res) => {
                                if (!err && res) cache[accountId]['children'][index]['courseInfo'] = JSON.parse(res.toString());
                                ++readyCourses;
                                checkFinally();
                            });
                        } else {
                            ++readyCourses;
                            checkFinally();
                        }
                    });
                }
                checkFinally();
            });
        });

        function checkFinally() {
            if ((readyAccounts === totalAccounts) && (readyCourses === totalCourses)) {
                resolve(cache);
            }
        }
    })
}

function getCoursesFromAccount(id) {
    return new Promise(resolve => {
        let cache = {};
        let readyCourses = 0, totalCourses = 0;
        const {accountId, ...login} = accounts[id - 1];
        new mega.Storage(login, (err, res) => {
            const courses = res.root.children.find(n => n.name === 'courses');
            if (courses) {
                totalCourses += courses.children.length || 0;
                cache[accountId] = courses;
                courses.children.forEach((course, index) => {
                    const data = course.children.find(c => c.name === 'data.json');
                    if (data) {
                        data.download((err, res) => {
                            if (!err && res) cache[accountId]['children'][index]['courseInfo'] = JSON.parse(res.toString());
                            ++readyCourses;
                            checkFinally();
                        });
                    } else {
                        ++readyCourses;
                        checkFinally();
                    }
                });
            }
            checkFinally();
        });

        function checkFinally() {
            if (readyCourses === totalCourses) {
                resolve(cache);
            }
        }
    })
}

function getNodes(node) {
    const {name, nodeId, type, children, accountId, courseInfo} = node;
    return new Node({
        name, nodeId, type, accountId, courseInfo,
        children: Array.isArray(children) ? children.map(getNodes) : null
    });
}

function getCoursesFromCache() {
    return new Promise(resolve => {
        getAllCourses().then(courses => {

            resolve(Object.entries(courses).reduce((acc, o) => {
                const [id, course] = o;
                acc = [
                    ...acc,
                    ...course.children.map(c => {
                        c.accountId = id;
                        return getNodes(c);
                    })
                ];
                return acc;
            }, []));
        })
    })
}

function find(path, node) {
    const nodesPath = path.split('/');
    const isDeep = nodesPath.length > 1;
    if (!Array.isArray(node.children)) return null;
    if (isDeep) {
        const directory = node.children.find(n => n.type === 1 && n.nodeId === nodesPath.slice(0, 1).join());
        if (directory) {
            return find(nodesPath.slice(1).join('/'), directory);
        } else {
            return null;
        }
    } else {
        return node.children.find(n => n.nodeId === nodesPath[0]);
    }
}

function getEmbed(url) {
    return url.replace('file', 'embed');
}

function initSyncCourses() {
    getAllCourses();
    interval = setInterval(getAllCourses, 24 * 60 * 60 * 1000)
}

function getCourse(accountId, idCourse) {
    return new Promise(resolve => {
        let courseFounded = null, response = null;
        getCoursesFromAccount(accountId).then(courses => {
            for (let [account, course] of Object.entries(courses)) {
                const exist = course.children.find(c => c.nodeId === idCourse);
                if (exist) {
                    courseFounded = exist;
                    break;
                }
            }

            if (courseFounded) {
                response = getNodes(courseFounded);
            }

            resolve(response);
        })
    })
}

module.exports = {
    getCoursesFromCache,
    getCourse,
    getCoursesFromAccount,
    find,
    getEmbed
};
