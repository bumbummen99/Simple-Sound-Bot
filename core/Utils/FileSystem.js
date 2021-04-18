const fs = require('fs');
const util = require('util');

class FileSystem {
    static fileOlderThan(path, date) {
        let stats
        try {
            stats = fs.statSync(path);
        } catch (e) {
            /* File not found, return true anyways */
            return true;
        }

        return date > new Date(util.inspect(stats.mtime));
    }
}

module.exports = FileSystem;