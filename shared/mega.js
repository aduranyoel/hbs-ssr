const mega = require('megajs');
const Node = require('../model/node');
const logger = require('./logger');

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

let lastGateway = 'https://eu.api.mega.co.nz/';

function getAllCourses() {
    return new Promise(resolve => {
        let cache = {};
        let readyAccounts = 0, totalAccounts = accounts.length, readyCourses = 0, totalCourses = 0;
        accounts.forEach(account => {
            const {accountId, ...login} = account;
            new mega.Storage(login, (err, res) => {
                lastGateway = res.api.gateway;
                logger('courses loaded, gateway: ', lastGateway);
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
    return new Promise((resolve, reject) => {
        const {accountId, ...login} = accounts[id - 1];
        new mega.Storage(login, (err, res) => {
            if (err) return reject(err);
            lastGateway = res.api.gateway;
            const courses = res.root.children.find(n => n.name === 'courses');
            if (courses) {
                resolve(courses);
            } else {
                reject(new Error("No courses found"));
            }
        });
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

            resolve(Object.entries(courses).reduce((acc, entries) => {
                const [id, course] = entries;
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

function findByNodeId(id, node) {
    if (!Array.isArray(node.children)) return null;
    const result = node.children.find(n => n.nodeId === id);
    if (result) return result;
    const folders = node.children.filter(n => n.type === 1);
    if (folders && folders.length) {
        for (let folder of folders) {
            const level = findByNodeId(id, folder);
            if (level) return level;
        }
    }
    return null;
}

function getEmbed(url) {
    return url.replace('file', 'embed');
}

module.exports = {
    getCoursesFromCache,
    getCoursesFromAccount,
    find,
    getEmbed,
    lastGateway,
    accounts,
    findByNodeId
};
