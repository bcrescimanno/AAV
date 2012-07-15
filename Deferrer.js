var Deferrer = function() {
    this.tasks = [];
    this.isActive = false;
};

Deferrer.prototype = {

    invokeLater: function (fn, scope) {
        this.tasks.push([fn, scope]);
        this.run();
    },

    run: function () {
        this.clear();
        this.isActive = true;
        this.timeout = window.setTimeout(this.process.bind(this), 50);
    },

    clear: function () {
        if(this.isActive) {
            window.clearTimeout(this.timeout);
        }
    },

    process: function () {
        var tasks = this.tasks,
            task;

        while ((task = this.tasks.pop())) {
            if (task[1]) {
                task[0].call(task[1]);
            } else {
                task[0]();
            }
        }

        this.isActive = false;
    }

};

var GlobalDeferrer = new Deferrer();
