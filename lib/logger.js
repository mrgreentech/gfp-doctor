module.exports = function(msg, options) {
    options = options instanceof Object ? options : {};

    if (options.verbose) {
        console.log(msg);
    }
};
