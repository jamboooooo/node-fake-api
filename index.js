const path = require('path')
const fs = require('fs')
const http = require('http')

const {
    getIndexById,
    getNextId,
    parseQuery
} = require('./functions')

const server = http.createServer((req, res) => {
    fs.readFile(path.resolve(__dirname, 'database.json'), (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.writeHead(200, {
                'Content-type': 'application/json;charset=utf-8'
            })
            data = JSON.parse(data)
            if (req.method === 'GET') {
                if (req.url === '/') {
                    res.write(JSON.stringify(data))
                } else {
                    const result = parseQuery(req.url)
                    if (result.id === null) {
                        res.write(JSON.stringify(data[result.resource]))
                    } else {
                        data[result.resource].forEach(item => {
                            if (item.id === Number(result.id)) return res.write(JSON.stringify(item))
                        });
                    }
                }
            } else if (req.method === 'DELETE') {
                res.writeHead(200, {
                    "Content-type": 'text/plain'
                })
                const result = parseQuery(req.url)
                data[result.resource].forEach((item, i) => {
                    if (item.id === Number(result.id)) {
                        data[result.resource].splice(i, 1)
                        readyData = JSON.stringify(data)
                        fs.writeFile(path.resolve(__dirname, 'database.json'), readyData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                });
                res.write('Данные успешно удалены')
            } else if (req.method === 'POST') {
                res.writeHead(200, {
                    "Content-type": 'text/plain'
                })
                let reqBody = ''
                req.on('data', (item) => {
                    reqBody += item
                })
                req.on('end', () => {
                    const result = parseQuery(req.url)
                    data[result.resource].push({
                        'id': getNextId(data[result.resource]),
                        'name': reqBody
                    })
                    fs.writeFile(path.resolve(__dirname, 'database.json'), JSON.stringify(data), (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                })
                res.write('Данные успешно добавлены')

            } else if (req.method === 'PATCH') {
                res.writeHead(200, {
                    "Content-type": 'text/plain'
                })
                const result = parseQuery(req.url)
                let dataByPatch = ''

                let indexByPatch = getIndexById(data[result.resource], Number(result.id))
                data[result.resource].forEach(item => {
                    if (item.id === indexByPatch) {
                        req.on('data', elem => {
                            dataByPatch += elem
                        })
                        req.on('end', () => {
                            item.name = dataByPatch
                            fs.writeFile(path.resolve(__dirname, 'database.json'), JSON.stringify(data), (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        })

                    }
                })
                res.write('Данные успешно обновлены')

            }
            res.end()
        }
    })
})

server.listen(3000)