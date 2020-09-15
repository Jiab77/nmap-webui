/*
Made by: Jiab77 <https://github.com/Jiab77>

Based on:
 - https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
 - https://blog.bloomca.me/2018/12/22/writing-a-web-server-node.html
 - https://nodejs.org/en/docs/guides/getting-started-guide/
 - https://www.w3schools.com/nodejs/nodejs_http.asp
*/

"use strict";

// Dependencies
const http = require('http');
const fs = require('fs');
const path = require('path');
const process = require('process');

// Config
const documentRoot = '.';
const debugMode = false;
const enableDirectoryListing = true;
const enableUrlDecoding = true;
const hostname = process.env.NODE_WEB_HOST || '127.0.0.1';
const port = process.env.NODE_WEB_PORT || 8001;

// Directory listing function
// Improved version of: https://stackoverflow.com/a/31831122
var directoryListing = function(dir, done) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err) {
            return done(err);
        }

        var pending = list.length;

        if (!pending) {
            return done(null, {name: path.basename(dir), type: 'folder', children: results});
        }

        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    directoryListing(file, function(err, res) {
                        results.push({
                            type: 'folder',
                            name: path.basename(file),
                            time: stat.mtime,
                            size: stat.size,
                            children: res
                        });
                        if (!--pending) {
                            done(null, results);
                        }
                    });
                }
                else {
                    results.push({
                        type: 'file',
                        name: path.basename(file),
                        size: stat.size,
                        time: stat.mtime
                    });
                    if (!--pending) {
                        done(null, results);
                    }
                }
            });
        });
    });
};

// Web server
http.createServer(function (request, response) {
    const url = request.url;

    console.log('[Info] Requested:', url);
    if (debugMode === true && enableUrlDecoding === true) {
        console.log('[Debug] Decoded:', decodeURI(url));
    }

    var filePath = url;

    // Correct root path
    if (filePath === '/') {
        filePath = documentRoot + '/index.html';
    }
    else {
        filePath = documentRoot + (enableUrlDecoding === true ? decodeURI(url) : url);
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mp3',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    // Serve static files
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code === 'ENOENT') {
                fs.readFile(documentRoot + '/404.html', function(error, content) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.end(content, 'utf-8');

                        // log served 404 page
                        console.log('[Info] Served 404 page.');
                    }
                });
            }
            else if (error.code === 'EISDIR' && enableDirectoryListing === true) {
                directoryListing(filePath, function(err, res) {
                    if(err) {
                        console.error(err);
                    }

                    // log directory content
                    if (debugMode === true) {
                        console.log('[Info] Served as JSON:', url);
                        console.log('[Debug] Encoded:', JSON.stringify(res));
                    }
                    else {
                        // log served response
                        console.log('[Info] Served as JSON:', url);
                    }

                    // return directory content as JSON
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(res), 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ...\n');

                // display error
                console.log('[Error] Could not serve request:', url);
                console.error(error);
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');

            // log served response
            console.log('[Info] Served:', url);
        }
    });

}).listen(port, hostname, () => {
    console.log(`NodeJS Development Server (http://${hostname}:${port}) started`);
});
