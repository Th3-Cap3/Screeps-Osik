var roleTechnician = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('Charging')
        }
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('Patching')
        }

        if(creep.memory.working) {
            creep.patchController();
        }
        else {
            creep.harvestEnergy();
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var technicians = _.filter(Game.creeps, (creep) => creep.memory.role == 'technician' && creep.room.name == room.name);
        console.log('Technicians: ' + technicians.length, room.name);

        if (technicians.length < room.memory.census.technician) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Technician' + Game.time;
            let body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            let memory = {role: 'technician'};
        
            return {name, body, memory};
    }
};

module.exports = roleTechnician;