function getIndexById(collection, id) {
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
            return collection[i].id
        }
    }

    return -1
}

function getNextId(collection) {
    if (collection.length === 0) return 1
    else {
        let max = 0;
        collection.forEach(item => {
            if (item.id > max) {
                max = item.id
            }
        });
        return max + 1;
    }
}

function parseQuery(url) {
    let rsrc = url.split('/')
    if (rsrc.length === 2) {
        return { resource: rsrc[1], id: null }
    }
    return { resource: rsrc[1], id: rsrc[2] }
}

module.exports = {
    getIndexById,
    getNextId,
    parseQuery
}