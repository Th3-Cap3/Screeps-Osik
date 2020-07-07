const creepLogic = require("../creeps");

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
        
        //Find closest target to creep that needs energy
        let target = this.pos.findClosestByRange(targets);
        
        //transfer energy to target
        if(this.pos.isNearTo(target)) {
            this.transfer(target, RESOURCE_ENERGY);
        } else {
            //Move to the selected target
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
    // validate memory target
    if (this.memory.repTarget) {
        var repTarget = Game.getObjectById(this.memory.repTarget);
        if (repTarget.hits >= repTarget.hitsMax * this.room.memory.config.wallTargetSize) {
            delete this.memory.repTarget;
        }
    }

    // if no target get new target
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

    // Do work, move closer, or refill energy
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