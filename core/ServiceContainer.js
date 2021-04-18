class ServiceContainer {
    constructor() {
        this._instances = new Map();
    }

    getServicesFolder() {
        return 'Services';
    }

    init(accessor, instance) {
        this._instances.set(accessor, instance);
    }

    deinit(accessor) {
        this._instances.delete(accessor);
    }

    get(accessor) {
        return this._instances.get(accessor);
    }
}

module.exports = new ServiceContainer();