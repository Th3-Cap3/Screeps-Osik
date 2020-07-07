/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: C:\Users\adane\Desktop\Screeps-Osik\src\main.js **********/
__modules[0] = function(module, exports) {
let creepLogic = __require(1,0);
let roomLogic = __require(2,0);
let prototypes = __require(3,0);


module.exports.loop = function () {
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    _.forEach(Game.rooms, function(room) {
        if (room && room.controller && room.controller.my) {
            roomLogic.spawning.run(room);
            roomLogic.job.run(room);
            roomLogic.turrets.run(room);
            roomLogic.memory.run(room);
        }
    })
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }

}
return module.exports;
}
/********** End of module 0: C:\Users\adane\Desktop\Screeps-Osik\src\main.js **********/
/********** Start module 1: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    worker:                 __require(4,1),
    technician:             __require(5,1),
    architect:              __require(6,1)
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\index.js **********/
/********** Start module 2: C:\Users\adane\Desktop\Screeps-Osik\src\room\index.js **********/
__modules[2] = function(module, exports) {
let roomControllers = {
    turrets: __require(7,2),
    spawning: __require(8,2),
    job: __require(9,2),
    memory: __require(10,2),
}
module.exports = roomControllers;
return module.exports;
}
/********** End of module 2: C:\Users\adane\Desktop\Screeps-Osik\src\room\index.js **********/
/********** Start module 3: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\index.js **********/
__modules[3] = function(module, exports) {
let files = {
    creep: __require(11,3),
    roomPositionLogic: __require(12,3),
    turret: __require(13,3)
}
return module.exports;
}
/********** End of module 3: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\index.js **********/
/********** Start module 4: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\role.worker.js **********/
__modules[4] = function(module, exports) {
const creepLogic = __require(1,4);

var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
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
    spawn: function(room) {
        var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' && creep.room.name == room.name);
        console.log('Workers: ' + workers.length, room.name);

        if (workers.length < room.memory.census.worker) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Worker' + Game.time;
            let body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            let memory = {role: 'worker'};
        
            return {name, body, memory};
    }
};

module.exports = roleWorker;
return module.exports;
}
/********** End of module 4: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\role.worker.js **********/
/********** Start module 5: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\role.technician.js **********/
__modules[5] = function(module, exports) {
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
    spawn: function(room) {
        var technicians = _.filter(Game.creeps, (creep) => creep.memory.role == 'technician' && creep.room.name == room.name);
        console.log('Technicians: ' + technicians.length, room.name);

        if (technicians.length < room.memory.census.technician) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Technician' + Game.time;
            let body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            let memory = {role: 'technician'};
        
            return {name, body, memory};
    }
};

module.exports = roleTechnician;
return module.exports;
}
/********** End of module 5: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\role.technician.js **********/
/********** Start module 6: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\role.architect.js **********/
__modules[6] = function(module, exports) {
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
            } else if (repTarget.hits < repTarget.hitsMax * this.room.memory.config.wallTargetSize) {
                creep.maintainWalls();
            } else {
                creep.patchController();
            }
        }
        else {
            creep.harvestEnergy();
        }
    },
    spawn: function(room) {
        var architects = _.filter(Game.creeps, (creep) => creep.memory.role == 'architect' && creep.room.name == room.name);
        console.log('Architects: ' + architects.length, room.name);

        if (architects.length < room.memory.census.architect) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Architect' + Game.time;
            let body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            let memory = {role: 'architect'};
        
            return {name, body, memory};
    }
};

module.exports = roleArchitect;
return module.exports;
}
/********** End of module 6: C:\Users\adane\Desktop\Screeps-Osik\src\creeps\role.architect.js **********/
/********** Start module 7: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_turrets.js **********/
__modules[7] = function(module, exports) {
var turretControl = {

    run: function(room) {
        var towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER)
            }

        });

        _.forEach(towers, function(tower) {
            if (tower) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => ((structure.hits < structure.hitsMax &&
                            structure.structureType !== STRUCTURE_WALL &&
                            structure.structureType !== STRUCTURE_RAMPART) ||
                        (structure.structureType == STRUCTURE_RAMPART &&
                            structure.hits < structure.hitsMax * room.memory.config.wallTargetSize))
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        })
    }
};

module.exports = turretControl;
return module.exports;
}
/********** End of module 7: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_turrets.js **********/
/********** Start module 8: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_spawn.js **********/
__modules[8] = function(module, exports) {
let creepRoles = __require(1,8);
let creepTypes = _.keys(creepRoles);

var spawnController = {

    /** @param {Room} room */
    run: function(room) {
        let creepTypeNeeded = _.find(creepTypes, function(type) {
            return creepRoles[type].spawn(room);
        });
        let creepSpawnData = creepRoles[creepTypeNeeded] && creepRoles[creepTypeNeeded].spawnData(room);

        if (creepSpawnData) {
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
return module.exports;
}
/********** End of module 8: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_spawn.js **********/
/********** Start module 9: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_jobs.js **********/
__modules[9] = function(module, exports) {
let creepRoles = __require(1,9)

var jobController = {
    run: function(room) {
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
return module.exports;
}
/********** End of module 9: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_jobs.js **********/
/********** Start module 10: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_memory.js **********/
__modules[10] = function(module, exports) {
var memoryController = {

    /** @param {Room} room */
    run: function(room) {
        if (!room.memory) {
            console.log('No Memory');
        }
        if (room.memory.census == undefined) {
            room.memory.census = {};
        }

        if (room.memory.census.architect == undefined) {
            room.memory.census.architect = 4;
        }

        if (room.memory.census.technician == undefined) {
            room.memory.census.technician = 4;
        }

        if (room.memory.census.worker == undefined) {
            room.memory.census.worker = 8;
        }
        if (room.memory.config == undefined) {
            room.memory.config = {};
        }

        if (room.memory.config.storage == undefined) {
            room.memory.config.storage = 'none';
        }

        if (room.memory.config.wallTargetSize == undefined) {
            room.memory.config.wallTargetSize = 0.0001;
        }
        checkStorage(room);
    }
};
function checkStorage(room) {
    let storage = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE)
        }
    })
    if (storage.length) {
        room.memory.config.storage = 'storage'
        return;
    }
    let containers = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER)
        }
    })
    if (containers.length) {
        room.memory.config.storage = 'container'
        return;
    }
    room.memory.config.storage = 'none';
}

module.exports = memoryController;
return module.exports;
}
/********** End of module 10: C:\Users\adane\Desktop\Screeps-Osik\src\room\controller_memory.js **********/
/********** Start module 11: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\creepFunctions.js **********/
__modules[11] = function(module, exports) {
const creepLogic = __require(1,11);

Creep.prototype.findEnergySource = function findEnergySource() {
    let sources = this.room.find(FIND_SOURCES_ACTIVE);
    if (sources.length) {
        let source = _.find(sources, function(s) {
            console.log(s.pos, s.pos.getOpenPositions())
            return s.pos.getOpenPositions().length > 0;
        });

        console.log(sources.length, source)
        if (source) {
            this.memory.source = source.id;

            return source;
        }
    }
}

Creep.prototype.fillEnergyStorage = function fillEnergyStorage() {
    var targets = this.room.find(FIND_MY_STRUCTURES);
    targets = _.filter(targets, function(energyStruct) {
        return (energyStruct.structureType == STRUCTURE_TOWER || energyStruct.structureType == STRUCTURE_SPAWN || energyStruct.structureType == STRUCTURE_EXTENSION) && energyStruct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    })
    if (targets.length) {
        let target = this.pos.findClosestByRange(targets);
        if(this.pos.isNearTo(target)) {
            this.transfer(target, RESOURCE_ENERGY);
        } else {
            this.moveTo(target);
        }
    } else {
        if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller);
        }
    }
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
    let storedSource = Game.getObjectById(this.memory.source);
    if (!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))) {
        delete this.memory.source;
        storedSource = this.findEnergySource();
    }    
    if (storedSource) {
        if (this.pos.isNearTo(storedSource)) {
            this.harvest(storedSource);
        } else {
            this.moveTo(storedSource);           
        }
    }
}

Creep.prototype.patchController = function patchController() {
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller);
    }
}

Creep.prototype.buildInfrastructure = function buildInfrastructure() {

}

Creep.prototype.buildDefenses = function buildDefenses() {

}

Creep.prototype.maintainWalls = function maintainWalls() {
    if (this.memory.repTarget) {
        var repTarget = Game.getObjectById(this.memory.repTarget);
        if (repTarget.hits >= repTarget.hitsMax * this.room.memory.config.wallTargetSize) {
            delete this.memory.repTarget;
        }
    }
    if (!this.memory.repTarget) {

        var sources = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL &&
                    structure.hits < structure.hitsMax * this.room.memory.config.wallTargetSize)
            }
        });

        if (sources.length) {
            repTarget = this.pos.findClosestByRange(sources)
            this.memory.repTarget = repTarget.id;
        }
    }
    if (this.memory.working) {
        if (this.pos.isNearTo(repTarget)) {
            this.repair(repTarget);
            if (repTarget.hits >= repTarget.hitsMax * this.room.memory.config.wallTargetSize) {
                delete this.memory.repTarget;
            }
        } else {
            this.moveTo(repTarget, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        }
    }
}
return module.exports;
}
/********** End of module 11: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\creepFunctions.js **********/
/********** Start module 12: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\roomPositionFunction.js **********/
__modules[12] = function(module, exports) {
const creepLogic = __require(1,12);

RoomPosition.prototype.getNearbyPositions = function getNearbyPositions(){
    var positions = [];

    let startX = this.x -1 || 1;
    let startY = this.y -1 || 1;

    for(x = startX; x <= this.x + 1 && x < 49; x++) {
        for(y = startY; y <= this.y + 1 && y < 49; y++) {
            if (x !== this.x || y !== this.y) {
                positions.push(new RoomPosition(x, y, this.roomName));
            }
        }
    }

    return positions;
}

RoomPosition.prototype.getOpenPositions = function getOpenPositions() {
    let nearbyPositions = this.getNearbyPositions();

    let terrain = Game.map.getRoomTerrain(this.roomName);

    let walkablePositions = _.filter(nearbyPositions, function(pos) {
        return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
    });

    let freePositions = _.filter(walkablePositions, function(pos) {
        return !pos.lookFor(LOOK_CREEPS).length;
    })

    return freePositions;
}
return module.exports;
}
/********** End of module 12: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\roomPositionFunction.js **********/
/********** Start module 13: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\turretFunctions.js **********/
__modules[13] = function(module, exports) {

return module.exports;
}
/********** End of module 13: C:\Users\adane\Desktop\Screeps-Osik\src\prototypes\turretFunctions.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
