import axios from "axios";
import { apiKey } from "../screens/StateProvider";

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
const futureEndpoint = params => `https://api.weatherapi.com/v1/future.json?key=${apiKey}&q=${params.cityName}&dt=${params.date}`;


const apicall= async (endpoint) =>{
    const options = {
        method: 'GET',
        url: endpoint
    }
    try{
        const response = await axios.request(options);
        return response.data;
    }catch(err) {
        //console.log('error: ',err);
        return null;
    }
}
export const fetchWeatherForecast = params=>{
    return apicall(forecastEndpoint (params));
}
export const fetchLocations = params=>{
    return apicall(locationsEndpoint (params));
}
export const fetchFuture = params=>{
    return apicall(futureEndpoint (params));
}