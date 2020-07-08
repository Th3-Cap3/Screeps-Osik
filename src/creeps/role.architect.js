var roleArchitect = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('Charging')
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('Working')
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizingPathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.patchController();
            }
        }
        else {
            creep.harvestEnergy();
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var architects = _.filter(Game.creeps, (creep) => creep.memory.role == 'architect' && creep.room.name == room.name);
        console.log('Architects: ' + architects.length, room.name);

        if (architects.length < 4) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Architect' + Game.time;
            let body = [WORK, CARRY, MOVE, MOVE, MOVE];
            let memory = {role: 'architect'};
        
            return {name, body, memory};
    }
};

module.exports = roleArchitect;