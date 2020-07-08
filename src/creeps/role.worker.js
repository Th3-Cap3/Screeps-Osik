const creepLogic = require(".");

var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        //Check state and update
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('Charging');
        }

        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('Working');
        }
        if (creep.memory.working) {
            creep.fillEnergyStorage();
        } else {
            creep.harvestEnergy();
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' && creep.room.name == room.name);
        console.log('Workers: ' + workers.length, room.name);

        if (workers.length < 8) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Worker' + Game.time;
            let body = [WORK, CARRY, MOVE, MOVE, MOVE];
            let memory = {role: 'worker'};
        
            return {name, body, memory};
    }
};

module.exports = roleWorker;