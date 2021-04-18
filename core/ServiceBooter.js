const path = require('path');
const fs = require('fs');
const ServiceContainer = require("./ServiceContainer");

module.exports = () => {
    const folder = ServiceContainer.getServicesFolder();
    for (const file of fs.readdirSync(path.join(__dirname, folder))) {
        const Service = require(`./${folder}/${file}`);
        ServiceContainer.init(Service.getIdentifier(), new Service());
    }
}