const http = require('http'); // or 'https' for https:// URLs
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

class Downloader {
    static get(URI, dest) {
        return new Promise((resolve, reject) => {
            let handler = URI.startsWith('https') ? https : http;

            const file = fs.createWriteStream(dest);
            try {
                handler.get(URI, (response) => {
                    response.pipe(file);
                    file.once('finish', () => {
                        file.close();
                        resolve();
                    });
                });
            } catch (e) {
                reject(e);
            }           
        });
    }
}

module.exports = Downloader;
