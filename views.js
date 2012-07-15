var View = function(el) {
    this.el = el;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.width = 0;
    this.height = 0;
    this.scaleFactor = 1;
    this.dirtyProperties = [];
    this.pendingRender = false;
};

View.prototype = {

    TRANSFORM_KEYS: {
        x: "x",
        y: "y", 
        z: "z", 
        scaleFactor: "scaleFactor"
    },

    addChild: function (child) {

    },

    removeChild: function (child) {

    },

    setX: function (x) {
        this.modifyProperty("x", x);
    },

    moveX: function (distance) {
        var x = this.x + distance;
        this.modifyProperty("x", x);
    },

    setY: function (y) {
        this.modifyProperty("y", y);
    },

    moveY: function (distance) {
        var y = this.y + distance;
        this.modifyProperty("y", y);
    },

    setZ: function (z) {
        this.modifyProperty("z", z);
    },

    moveZ: function (distance) {
        var z = this.z + distance;
        this.modifyProperty("z", z);
    },

    setWidth: function (w) {
        w = Math.max(w, 0);
        this.modifyProperty("width", w);
    },

    setHeight: function (h) {
        h = Math.max(h, 0);
        this.modifyProperty("height", h);
    },

    scale: function (scale) {
        scale = Math.max(scale, 0);
        this.modifyProperty("scaleFactor", scale);
    },

    scaleBy: function (scale) {
        this.scale(scale + this.scale);
    },

    modifyProperty: function (propKey, value) {
        if (this[propKey] !== value) {
            this[propKey] = value;
            this.dirtyProperties.push(propKey);
            this.render();
        }
    },

    render: function (immediate) {
        if (immediate) {
            this.doRender();
        } else if (!this.pendingRender) {
            this.pendingRender = true;
            GlobalDeferrer.invokeLater(this.doRender, this);
        }
    },

    doRender: function () {
        var properties = this.dirtyProperties,
            key,
            value,
            isTransform;

        while ((key = properties.pop())) {
            isTransform = this.TRANSFORM_KEYS[key] !== undefined;

            if (this.isTransformDirty && isTransform) {
                this.renderTransform();
            } else if (!isTransform) {
                value = this[key];
                this.el.style[key] = value + "px";
            }
        }

        this.isTransformDirty = true;
        this.pendingRender = false;
    },

    renderTransform: function () {
        this.el.style.webkitTransform = "translate3d(" +
            this.x + "px, " + 
            this.y + "px, " +
            this.z + "px) " +
            "scale(" + 
            this.scaleFactor + 
            ")";

        this.isTransformDirty = false;
    }

};
