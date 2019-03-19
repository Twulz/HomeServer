const knex = require('knex');

class Database {

    constructor(config) {
        this.knex = knex({
          client: 'mysql',
          connection: config
        })
      }

    createSchema() {
        return this.knex.schema
            // Drop tables if they weren't destroyed - so can start again
            .dropTableIfExists('access_link')
            .dropTableIfExists('package')
            .dropTableIfExists('access_fob_card')
            .dropTableIfExists('temperature')
            .dropTableIfExists('outside_light')
            .dropTableIfExists('inside_light')
            .dropTableIfExists('lights')
            .dropTableIfExists('humidity')
            .dropTableIfExists('moisture')
            .dropTableIfExists('sensors')
            .dropTableIfExists('sensor_types')
            .dropTableIfExists('garden_sections')
            .dropTableIfExists('room')

            // Create tables for package box
            .createTable('package', table => {
                table.increments('packageId').unsigned().notNullable().primary()
                table.string('packageDesc', 45)
                table.string('keypadCode', 6).notNullable().unique()
                table.integer('packageInBox').notNullable().defaultTo(1)
                table.string('pickedUpBy').defaultTo(null)
                table.date('pickedUpDate')
            })
            .createTable('access_fob_card', table => {
                table.increments('accessFobCardId').unsigned().notNullable().primary()
                table.string('fobCardCode').notNullable()
            })
            .createTable('access_link', table => {
                table.integer('packageId').unsigned().notNullable()
                table.integer('fobCardId').unsigned().notNullable()
                table.foreign('packageId').references('package.packageId')
                table.foreign('fobCardId').references('access_fob_card.accessFobCardId')
                table.primary(['packageId', 'fobCardId'])
            })
            
            .createTable('room', table => {
                table.increments('room_id').unsigned().notNullable().primary()
                table.string('description').notNullable()
                table.float('preset_temp').notNullable().defaultTo(0.0)
                table.integer('heater_state').notNullable().defaultTo(0)
                table.integer('cooling_state').notNullable().defaultTo(0)
                table.integer('blind_state').notNullable().defaultTo(0)
            })

            .createTable('garden_sections', table => {
                table.increments('section_id').unsigned().notNullable().primary()
                table.string('description').notNullable()
                table.integer('minMoisture').unsigned().defaultTo(null)
                table.integer('criticalMoisture').unsigned().defaultTo(null)
                table.integer('lightSensitivity').unsigned().defaultTo(null)
                table.float('current_sun').notNullable().defaultTo(50.0)
                table.integer('valve_state').notNullable().defaultTo(0)
            })

            .createTable('sensor_types', table => {
                table.increments('sensor_type_id').unsigned().notNullable().primary()
                table.string('sensor_name').notNullable()
            })

            .createTable('sensors', table => {
                table.increments('sensor_id').unsigned().notNullable().primary()
                table.integer('sensor_type').unsigned().notNullable()
                table.integer('room_id').unsigned().defaultTo(null)
                table.integer('garden_section_id').unsigned().defaultTo(null)
                table.dateTime('last_replaced').notNullable().defaultTo(this.knex.raw('NOW()'))
                table.foreign('sensor_type').references('sensor_types.sensor_type_id')
                table.foreign('room_id').references('room.room_id')
                table.foreign('garden_section_id').references('garden_sections.section_id')
            })

            .createTable('humidity', table => {
                table.timestamp('timestamp').notNullable().defaultTo(this.knex.raw('NOW()'))
                table.integer('sensor_id').unsigned().notNullable()
                table.integer('humidityValue').notNullable()
                table.foreign('sensor_id').references('sensors.sensor_id')
                table.primary(['timestamp', 'sensor_id'])
            })

            .createTable('moisture', table => {
                table.timestamp('timestamp').notNullable().defaultTo(this.knex.raw('NOW()'))
                table.integer('sensor_id').unsigned().notNullable()
                table.integer('moistureLevel').notNullable()
                table.foreign('sensor_id').references('sensors.sensor_id')
                table.primary(['timestamp', 'sensor_id'])
            })

            .createTable('temperature', table => {
                table.timestamp('timestamp').notNullable().defaultTo(this.knex.raw('NOW()'))
                table.integer('sensor_id').unsigned().notNullable()
                table.float('temperature').notNullable()
                table.foreign('sensor_id').references('sensors.sensor_id')
                table.primary(['timestamp', 'sensor_id'])
            })

            .createTable('outside_light', table => {
                table.timestamp('timestamp').notNullable().defaultTo(this.knex.raw('NOW()'))
                table.integer('sensor_id').unsigned().notNullable()
                table.float('sun_percent').notNullable()
                table.foreign('sensor_id').references('sensors.sensor_id')
                table.primary(['timestamp', 'sensor_id'])
            })

            .createTable('inside_light', table => {
                table.timestamp('timestamp').notNullable().defaultTo(this.knex.raw('NOW()'))
                table.integer('sensor_id').unsigned().notNullable()
                table.integer('brightnessValue').notNullable()
                table.foreign('sensor_id').references('sensors.sensor_id')
                table.primary(['timestamp', 'sensor_id'])
            })

            .createTable('lights', table => {
                table.increments('light_id').unsigned().notNullable().primary()
                table.integer('room_id').unsigned().notNullable()
                table.integer('state').notNullable().defaultTo(0)
                table.foreign('room_id').references('room.room_id')
            })

            // Done!
            .then(() => 'Success')
    }

    destroySchema() {
        return this.knex.schema
            .dropTableIfExists('access_link')
            .dropTableIfExists('package')
            .dropTableIfExists('access_fob_card')
            .dropTableIfExists('temperature')
            .dropTableIfExists('outside_light')
            .dropTableIfExists('inside_light')
            .dropTableIfExists('lights')
            .dropTableIfExists('humidity')
            .dropTableIfExists('moisture')
            .dropTableIfExists('sensors')
            .dropTableIfExists('sensor_types')
            .dropTableIfExists('garden_sections')
            .dropTableIfExists('room')
            .then(() => 'Success')
    }

    initDatabase(data) {
        // You need to manually create the database before calling this.

        // Populate database
        return this.createSchema()
            .then(() => this.knex.insert(data.package).into('package'))
            .then(() => this.knex.insert(data.access_fob_card).into('access_fob_card'))
            .then(() => this.knex.insert(data.access_link).into('access_link'))
            .then(() => this.knex.insert(data.room).into('room'))
            .then(() => this.knex.insert(data.garden_sections).into('garden_sections'))
            .then(() => this.knex.insert(data.sensor_types).into('sensor_types'))
            .then(() => this.knex.insert(data.sensors).into('sensors'))
            .then(() => this.knex.insert(data.temperature).into('temperature'))
            .then(() => this.knex.insert(data.outside_light).into('outside_light'))
            .then(() => this.knex.insert(data.lights).into('lights'))
            .then(() => 'Success')
    }

    isAllowedFobAccess(fobCardCode) {
        return this.knex
            .select('*')
            .from('access_fob_card')
            .where('fobCardCode', fobCardCode);
    }

    isAllowedKeypadAccess(keyCode) {
        return this.knex
            .select('*')
            .from('package')
            .where('keypadCode', keyCode)
            .andWhere('packageInBox', 1)
    }

    getHeatingCooling(room_id) {
        return this.knex
            .select('*')
            .from('room')
            .where('room_id', room_id )
            .then((result) => {return result})
    }

    insertTemperature(sensor_id, temp) {
        return this.knex('temperature')
            .insert({'sensor_id': sensor_id, 'temperature': temp})
            .then(() => 'Success')
    }

    getSensorRoom(sensor_id) {
        return this.knex
            .select('room_id')
            .from('sensors')
            .where('sensor_id', sensor_id)
            .then((room_id) => {return room_id[0]})
    }

    getSensorGardenSection(sensor_id) {
        return this.knex
            .select('garden_section_id')
            .from('sensors')
            .where('sensor_id', sensor_id)
            .then((garden_section_id) => {return garden_section_id[0]})
    }

    updateHeaterCoolerState(heater_state, cooling_state, room_id) {
        return this.knex('room')
            .update({
                'heater_state': heater_state,
                'cooling_state': cooling_state
            })
            .where('room_id', room_id)
            .then(() => 'Success')
    }

    insertOutsideLight(sensor_id, sun_percent) {
        return this.knex('outside_light')
            .insert({'sensor_id': sensor_id, 'sun_percent': sun_percent})
            .then(() => 'Success')
    }

    deleteOldOutsideLightData() {
        return this.knex('outside_light')
            .where(this.knex.raw('timestamp < (NOW() - INTERVAL 15 MINUTE)'))
            .del()
            .then(() => 'Success')
    }

    updateBlindState(blind_state, room_id) {
        return this.knex('room')
            .update({ 'blind_state': blind_state })
            .where('room_id', room_id)
            .then(() => 'Success')
    }

    getRoomLightValues(room_id) {
        return this.knex
            .select('light_id', 'state')
            .from('lights')
            .where('room_id', room_id)
            .then((result) => {return result})
    }

    insertInsideLight(sensor_id, brightnessValue) {
        return this.knex('inside_light')
            .insert({'sensor_id': sensor_id, 'brightnessValue': brightnessValue})
            .then(() => 'Success')
    }

    updateRoomLightState(light_state, room_id) {
        return this.knex('lights')
            .update({ 'state': light_state })
            .where('room_id', room_id)
            .then(() => 'Success')
    }

    getGardenSectionData(section_id) {
        return this.knex
            .select('*')
            .from('garden_sections')
            .where('section_id', section_id)
            .then((result) => {return result[0]})
    }

    insertMoistureLevel(sensor_id, moistureLevel) {
        return this.knex('moisture')
            .insert({'sensor_id': sensor_id, 'moistureLevel': moistureLevel})
            .then(() => 'Success')
    }

    updateGardenWaterState(water_state, section_id) {
        return this.knex('garden_sections')
            .update({'valve_state': water_state})
            .where('section_id', section_id)
            .then(() => 'Success')
    }

    updateGardenSunState(sun_percent, section_id) {
        return this.knex('garden_sections')
            .update({'current_sun': sun_percent})
            .where('section_id', section_id)
            .then(() => 'Success')
    }
    
};

module.exports = Database;