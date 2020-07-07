let creepRoles = require("../creeps/index");
let creepTypes = _.keys(creepRoles);

var spawnController = {

    /** @param {Room} room */
    run: function(room) {

        // find a creep type that returns true for the .spawn() function
        let creepTypeNeeded = _.find(creepTypes, function(type) {
            return creepRoles[type].spawn(room);
        });

        // get the data for spawning a new creep of creepTypeNeeded
        let creepSpawnData = creepRoles[creepTypeNeeded] && creepRoles[creepTypeNeeded].spawnData(room);

        if (creepSpawnData) {
            // find the first or 0th spawn in the room
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            creepSpawnData.body = getBody(creepSpawnData.body, room)
            let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {
                memory: creepSpawnData.memory
            });
            if (result == 0) {
                console.log("Spawned: " + creepSpawnData.name)
            }
        }
    }
};

function getBody(segment, room) {
    let body = [];
    let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
    let energyAvailable = room.energyCapacityAvailable;
    let maxSegments = Math.floor(energyAvailable / segmentCost);

    _.times(maxSegments, function() {
        _.forEach(segment, s => body.push(s));
    });

    return body;
};

module.exports = spawnController;