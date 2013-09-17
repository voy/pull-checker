module.exports = {
    extend: function extend(cls, extensions) {
        for (var prop in extensions) {
            if (extensions.hasOwnProperty(prop)) {
                cls.prototype[prop] = extensions[prop];
            }
        }
    }
};
