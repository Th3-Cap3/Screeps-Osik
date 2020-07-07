var memoryController = {

    /** @param {Room} room */
    run: function(room) {
        // init room memory
        if (!room.memory) {
            console.log('No Memory');
        }

        // Creeps Setup
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

        // Config Setup
        if (room.memory.config == undefined) {
            room.memory.config = {};
        }

        if (room.memory.config.storage == undefined) {
            room.memory.config.storage = 'none';
        }

        if (room.memory.config.wallTargetSize == undefined) {
            room.memory.config.wallTargetSize = 0.0001;
        }

        // Check for storage type
        checkStorage(room);
    }
};

// Check to see if we are direct, containers, or storage
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