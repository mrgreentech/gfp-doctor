module.exports = function(msg, options) {
    options = Object(options);

    if (options.verbose) {
        console.log(msg);
    }
};
