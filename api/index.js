const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');

const data = require('./urls.json');

function writeFile(callback) {
    fs.writeFile(
        path.join(__dirname, "urls.json"),
        JSON.stringify(data, null, 4),
        err => {
            if (err) throw err

            callback(JSON.stringify({ message: "ok" }));
        }
    )
}

http.createServer((req, res) => {

    const { name, url, del } = URL.parse(req.url, true).query;

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    });

    //all jsons
    if (!name || !url) {
        return res.end(JSON.stringify(data));
    }

    //delete a json
    if (del) {
        data.urls = data.urls.filter(item => String(item.url) !== String(url));
        return writeFile((message) => res.end(message));
    }

    //insert a json
    data.urls.push({ name, url });
    return writeFile((message) => res.end(message));


}).listen(3000, () => console.log('Api is running'));