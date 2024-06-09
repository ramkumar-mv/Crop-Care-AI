const server = {
    base: "https://ecopalapi.herokuapp.com/",

    // LIGHTS //
    turnOnLight: (room, status) => `setLight/${room}/${status}/`,
    getLight: (room) => `getLight/${room}/`,
    getLightHistory: (room) => `getLights/${room}/`,

    // SCHEDULER
    weekdayOn: (room, time) => `weekdayLightOn/${room}/${time}/`,
    weekdayOff: (room, time) => `weekdayLightOff/${room}/${time}/`,
    weekendOn: (room, time) => `weekendLightOn/${room}/${time}/`,
    weekendOff: (room, time) => `weekendLightOff/${room}/${time}/`,
    pause: (room) => `pauseLight/${room}/`,
    resume: (room) => `resumeLight/${room}/`,
    weekdayThermostatOn: (temp, time) => `weekdayThermostatOn/${temp}/${time}/`,
    weekdayThermostatOff: (temp, time) =>
        `weekdayThermostatOff/${temp}/${time}/`,
    weekendThermostatOn: (temp, time) => `weekendThermostatOn/${temp}/${time}/`,
    weekendThermostatOff: (temp, time) =>
        `weekendThermostatOff/${temp}/${time}/`,
    pauseThermo: () => `pauseThermostat/`,
    resumeThermo: () => `resumeThermostat/`,

    // THERMOSTAT //
    setTemp: (temp) => `setTemp/${temp}/`,
    getTemp: (timestamp) => `getLight/${timestamp}/`, //timestamp format: 'YYYY-MM-DDThh:mm:ssZ'
    getTempHistory: "getTemps/",
};

export default server;
