var turretControl = {

    run: function(room) {
        // find all the towers in the room
        var towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER)
            }

        });

        _.forEach(towers, function(tower) {
            if (tower) {
                // find all structures that need repair
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => ((structure.hits < structure.hitsMax &&
                            structure.structureType !== STRUCTURE_WALL &&
                            structure.structureType !== STRUCTURE_RAMPART) ||
                        (structure.structureType == STRUCTURE_RAMPART &&
                            structure.hits < structure.hitsMax * room.memory.config.wallTargetSize))
                });
                // find the closest structure and repair it
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }

                // check for enemies and shoot it
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        })
    }
};

module.exports = turretControl;