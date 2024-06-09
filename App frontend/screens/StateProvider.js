import { useState, createContext } from "react";

const nitroAmount = {
    Nitrogen: [require("../assets/Nitrogen-1.jpg"), 1],
};
const infoAmount = {
    Name: [require("../assets/Nitrogen-1.jpg"), 1],
    Region: [require("../assets/Nitrogen-1.jpg"), 1],
    Crops: [require("../assets/Nitrogen-1.jpg"), 1],
};
const phosAmount = {
    Phosphorous : [require("../assets/Phosphorus.jpeg"), 1],
};

const potasAmount = {
    Potassium : [require("../assets/Potassium.jpeg"), 1],
};

const tempAmount = {
    Temperature: [require("../assets/thermometer.jpeg"), 1],
};

const humAmount = {
    Humidity: [require("../assets/humidity.png"), 1],
};

const acidAmount = {
    pH: [require("../assets/pH.png"), 1],
};

const rainAmount = {
    Rain: [require("../assets/rainfall.jpeg"), 1],
};

export const weatherImages = {
    'Partly Cloudy ': require('../assets/partlycloudy.png'),
    'Moderate rain': require('../assets/moderate.png'),
    'Patchy rain possible': require ('../assets/moderate.png'),
    'Patchy rain nearby': require ('../assets/moderate.png'),
    'Sunny': require('../assets/sun1.png'),
    'Clear': require ('../assets/sun1.png'),
    'Overcast': require('../assets/cloud.jpeg'),
    'Cloudy': require('../assets/cloud.jpeg'),
    'Light rain': require('../assets/moderate.png'),
    'Moderate rain at times': require('../assets/moderate.png'),
    'Heavy rain': require ('../assets/heavy.png'),
    'Heavy rain at times': require('../assets/heavy.png'),
    'Moderate or heavy freezing rain': require('../assets/heavy.png'),
    'Moderate or heavy rain shower': require ('../assets/heavy.png'),
    'Moderate or heavy rain with thunder': require('../assets/heavy.png'),
    'other': require('../assets/moderate.png')
}

export const StateContext = createContext();

export const apiKey = '507d224de37147b8b4f40229240902';

export const StateProvider = (props) => {
    const [userID, setUserID] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    const [transportItems, setTransportItems] = useState([]);
    // Value's that goes through to all components
    const value = {
        userID,
        nitroAmount,
        tempAmount,
        phosAmount,
        potasAmount,
        humAmount,
        foodItems,
        acidAmount,
        rainAmount,
        infoAmount,
        setUserID,
        setFoodItems,
        setTransportItems,
        transportItems,
    };

    return (
        <StateContext.Provider value={value}>
            {props.children}
        </StateContext.Provider>
    );
};
