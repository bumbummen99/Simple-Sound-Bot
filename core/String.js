class String {
    static excerpt(input, length) {
        return input.length > length ? input.slice(0, length - 1) + '…' : input;
    }
}

module.exports = String;