class YouTube {
    static getIdFromURL(url) {
        if (url != undefined || url != '') {
            /* Try to get the ID from the YouTube URL */
            const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/);
            
            if (match && match[2].length == 11) {
                return match[2];
            }
        }

        return null;
    }
}

module.exports = YouTube;