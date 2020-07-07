let creepRoles = require("../creeps/index")

var jobController = {
    run: function(room) {
        // Grab a creep and run its Job
        for (var name in Memory.creeps) {
            let creep = Game.creeps[name];
            if (!creep) {
                console.log('Clearing non-existing creep memory:', name);
                delete Memory.creeps[name];
            } else {
                creepRoles[creep.memory.role].run(creep);
            }
        }
    }
}

module.exports = jobController;