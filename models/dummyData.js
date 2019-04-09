module.exports = {

    package: [
        {packageDesc: "Package 1", keypadCode: "123456"},
        {packageDesc: "Package 2", keypadCode: "1234AB"}
    ],

    access_fob_card: [
        {fobCardCode: "3644385E"},
        {fobCardCode: "20B6F9A3"},
        {fobCardCode: "D62A5A5E"}
    ],

    access_link: [
        {packageId: 1, fobCardId: 1},
        {packageId: 2, fobCardId: 2}
    ],

    room: [
        {description: "Kitchen", preset_temp: 23},
        {description: "Living Room", preset_temp: 23},
        {description: "Bedroom 1", preset_temp: 20},
        {description: "Bedroom 2", preset_temp: 22},
        {description: "Bedroom 3", preset_temp: 18}
    ],

    temperature: [
        {timestamp: "2018-08-12 16:59:30", sensor_id: 1, temperature: 21.5},
        {timestamp: "2018-08-12 17:00:00", sensor_id: 1, temperature: 21.4},
        {timestamp: "2018-08-12 17:00:00", sensor_id: 2, temperature: 22.5}
    ],

    outside_light: [
        {timestamp: "2018-08-12 16:59:30", sensor_id: 3, sun_percent: 20.0}
    ],

    garden_sections: [
        {description: "Herb Garden", valve_state: 0},
        {description: "Flower Garden", valve_state: 0}
    ],

    sensor_types: [
        {sensor_name: "Temperature"},
        {sensor_name: "LDR"},
        {sensor_name: "Moisture"},
        {sensor_name: "Humidity"}
    ],

    sensors: [
        {sensor_type: 1, room_id: 1 , last_replaced: "2018-08-02 16:00:00"}, // Sensor 1: Temperature Room 1
        {sensor_type: 1, room_id: 2 , last_replaced: "2018-08-02 16:00:00"}, // Sensor 2: Temperature Room 2
        {sensor_type: 2, room_id: 1 , last_replaced: "2018-08-02 16:00:00"}, // Sensor 3: LDR outside Room 1
        {sensor_type: 2, room_id: 1 , last_replaced: "2018-08-02 16:00:00"}, // Sensor 4: LDR inside of Room 1
        {sensor_type: 2, garden_section_id: 1 , last_replaced: "2018-08-02 16:00:00"}, // Sensor 5: LDR in garden section 1
        {sensor_type: 4, garden_section_id: 1 , last_replaced: "2018-08-02 16:00:00"}, // Sensor 6: Humidity in garden section 1
        {sensor_type: 3, garden_section_id: 1 , last_replaced: "2018-08-02 16:00:00"}, // Sensor 7: Moisture in garden section 1
        {sensor_type: 1, garden_section_id: 1 , last_replaced: "2018-08-02 16:00:00"}  // Sensor 8: Temperature in garden section 1
    ],

    lights: [
        {room_id: 1, state: 1},
        {room_id: 1, state: 1},
        {room_id: 1, state: 0},
        {room_id: 2, state: 0},
        {room_id: 2, state: 0},
        {room_id: 2, state: 0},
        {room_id: 3, state: 0},
        {room_id: 3, state: 0},
        {room_id: 3, state: 0}
    ]

}