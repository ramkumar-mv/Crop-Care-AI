import React, { useCallback, useState, useContext } from 'react';
import { View, Text, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';
import { useEffect } from 'react';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native';
import {CalendarDaysIcon}from 'react-native-heroicons/outline';
import {debounce} from 'lodash';
import { fetchLocations,fetchWeatherForecast } from '../constants/weather';
import { weatherImages } from './StateProvider';
import * as Progress from 'react-native-progress';
import { getData,storeData } from '../utils/asyncStorage';
import { StateContext } from "./StateProvider";
import { app1 } from "../firebase";
import {
    doc,
    getFirestore,
    getDoc,
    setDoc,
    increment, 
    updateDoc,
    deleteField,
} from "firebase/firestore";
import { fetchFuture } from '../constants/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getDateString = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};


export default function HomeScreen() {
    const {userID}  = useContext(StateContext);
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState ({});
    const [loading,setLoading] = useState(true);
    const [dateString, setDateString] = useState(getDateString());
    const [monthlyForecasts, setMonthlyForecasts] = useState([]); // Add monthlyForecasts state

    const year = 2024;

    const db = getFirestore(app1);

    const handleLocation = (loc) => {
        //console.log('location: ', loc); 
        setLocations([]); 
        toggleSearch(false);
        setLoading(true)
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false);
            storeData('city',loc.name);
            //console.log('got forecast:', data); 
            //console.log('date:', loc.localtime);
        })
    }

    const handleSearch = value=>{
        //console.log('User ID:', userID);
        // fetch locations 
    if(value. length>2) { 
        fetchLocations ({cityName: value}).then (data=>{
            //console.log('search location:', data);
            setLocations(data)
    })
    }
    }

    useEffect (()=>{
        fetchMyWeatherData ( );   
    }, []) ;

    const fetchMyWeatherData = async ()=>{
        let mycity = await getData('city');
        let cityName = 'Tiruppur'
        if (mycity) cityName = mycity
        fetchWeatherForecast({
        cityName,
        days: '7'
        }).then (data=>{
        setWeather(data) ;
        setLoading(false)
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch,1200),[]);

    const {current,location,forecast} = weather;

    const storeTemperatureAndHumidityData = async () => {
        if (!userID || !current || current.temp_c === undefined || current.humidity === undefined) {
            //console.error('Error: User ID or current data is missing or incomplete.');
            return;
        }
    
        const todayDate = '2024-05-17'; 
        //console.log(todayDate)// Get today's date
        const dateString = todayDate; // Use the same date for humidity, or modify as needed

        // Reference to Firestore document for temperature and humidity
        const temperatureDocRef = doc(db, `userInfo/${userID}/temperatureTotals`, todayDate);
        const humidityDocRef = doc(db, `userInfo/${userID}/humidityTotals`, dateString); 

        try {
            // Set temperature data
            await setDoc(temperatureDocRef, {
                Temperature: current?.temp_c,
                total: current?.temp_c,
            });

            // Set humidity data
            await setDoc(humidityDocRef, {
                Humidity: current?.humidity,
                total : current?.humidity,
            });

            console.log('Temperature and humidity data stored successfully.');
        } catch (error) {
            //console.error('Error storing temperature and humidity data:', error);
        }
    };

    useEffect(() => {
        storeTemperatureAndHumidityData(); 
    }, [current]);   

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    async function calculateAverageTemperatureForMonth(cityName, month, year) {
        let totalTemperature = 0;
        let totalDays = 0;

        for (let day = 1; day <= daysInMonth(month, year); day++) {
            const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const response = await fetchFuture({ cityName, date: dateString });
            if (response && response.forecast && response.forecast.forecastday.length > 0) {
                const forecast = response.forecast.forecastday[0];
                totalTemperature += forecast.day.avgtemp_c; 
                totalDays++;
            }
        }

        // Calculate average temperature for the month
        const averageTemperature = totalTemperature / totalDays;
        return averageTemperature;
    }

    // Function to get the number of days in a month
    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    // Function to iterate over each month and calculate average temperature
    async function calculateAverageTemperatureForYear(cityName, year) {
        const averageTemperatures = [];
        
        // Loop through each month
        for (let month = 1; month <= 12; month++) {
            // Calculate average temperature for the month
            const averageTemperature = await calculateAverageTemperatureForMonth(cityName, month, year);
            averageTemperatures.push({ month, averageTemperature });
        }

        return averageTemperatures;
    }

    // Main function to display average temperatures for each month
    async function displayAverageTemperatures1(cityName, year) {
        const averageTemperatures = await calculateAverageTemperatureForYear(cityName, year);
        
        // Display average temperatures for each month
        averageTemperatures.forEach(({ month, averageTemperature }) => {
            console.log(`Average temperature for ${getMonthName(month)} ${year}: ${averageTemperature.toFixed(2)}°C`);
        });
    }
    async function displayAverageTemperatures(cityName, year) {
        const averageTemperatures = await calculateAverageTemperatureForYear(cityName, year);
        return averageTemperatures;
    }
    // Helper function to get month name from month number
    function getMonthName(month) {
        return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
    }
    displayAverageTemperatures1(weather.location?.name, year);
    console.log(weather.location?.name)
    //console.log(weather.forecast.day?.avgtemp_c)


    useEffect(() => {
        if (weather.location?.name) {
            displayAverageTemperatures(weather.location?.name, year)
                .then(averageTemperatures => {
                    setMonthlyForecasts(averageTemperatures);
                })
                .catch(error => {
                    console.error('Error fetching average temperatures:', error);
                });
        }
    }, [weather.location?.name]);

    async function displayAverageTemperatures(cityName, year) {
        const averageTemperatures = await calculateAverageTemperatureForYear(cityName, year);
    
        let highestTemp = -Infinity; 
        let highestMonth = '';
        let lowestTemp = Infinity;
        let lowestMonth = '';
    
        averageTemperatures.forEach(({ month, averageTemperature }) => {
            // Check for highest temperature
            if (averageTemperature > highestTemp) {
                highestTemp = averageTemperature;
                highestMonth = getMonthName(month);
            }
            // Check for lowest temperature
            if (averageTemperature < lowestTemp) {
                lowestTemp = averageTemperature;
                lowestMonth = getMonthName(month); r
            }
        });
    
        // Display alerts for highest and lowest temperatures
        alert(`The highest average temperature is in ${highestMonth} with ${highestTemp.toFixed(2)}°C`);
        alert(`The lowest average temperature is in ${lowestMonth} with ${lowestTemp.toFixed(2)}°C`);
    }

    useEffect(() => {
        // Check if monthly forecasts exist for the current location in AsyncStorage
        const checkMonthlyForecasts = async () => {
            const storedForecasts = await AsyncStorage.getItem('monthlyForecasts');
            if (storedForecasts) {
                // If forecasts exist, parse and set them in the state
                setMonthlyForecasts(JSON.parse(storedForecasts));
            } else {
                // If forecasts don't exist, fetch them and store in AsyncStorage
                fetchAndStoreMonthlyForecasts();
            }
        };

        checkMonthlyForecasts();
    }, [weather.location?.name]); // Fetch and store forecasts when location changes

    const fetchAndStoreMonthlyForecasts = async () => {
        if (weather.location?.name) {
            const forecasts = await calculateAverageTemperatureForYear(weather.location.name, year);
            setMonthlyForecasts(forecasts);
            // Store forecasts in AsyncStorage
            await AsyncStorage.setItem('monthlyForecasts', JSON.stringify(forecasts));
        }
    };



    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <StatusBar style="light" />
            <Image
                blurRadius={70}
                source={require('../assets/bg.png')}
                style={{ position: 'absolute', height: '100%', width: '100%' }}
            />
            {
                loading?(
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Progress.CircleSnail thickness = {10} size = {140} color="#0bb3b2"/>
                    </View>

                ):(
                    <SafeAreaView style={{ flex: 1 }}>
                {/* search section */}
                <View style={{ height: '7%' }} className="mx-4 relative z-50">
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 999, backgroundColor: showSearch? theme.bgWhite(0.2): 'transparent' }}>
                        {showSearch ? (
                            <TextInput
                                onChangeText={handleTextDebounce}
                                placeholder="Search city"
                                placeholderTextColor="lightgray"
                                style={{ paddingLeft: 10, height: 30, flex: 1, fontSize: 16, color: 'white' }}
                            />
                        ) : null}
                        <TouchableOpacity
                            onPress={() => toggleSearch(!showSearch)}
                            style={{backgroundColor: theme.bgWhite(0.3),borderRadius: 999, padding: 10, margin: 8, paddingLeft:10 }}
                        >
                            <MagnifyingGlassIcon size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                    {
                    locations.length > 0 && showSearch ? (
                        <View style={{ position: 'absolute', width: '100%', backgroundColor: "white", top: 70, borderRadius: 20 }}>
                            {locations.map((loc, index) => {
                                let showBorder = index + 1 !== locations.length;
                                let borderClass = showBorder ? ' border-b-2 border-gray-400' : '';
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleLocation (loc)}
                                        key={index}
                                        style={{ backgroundColor: theme.bgWhite(0.9),flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, marginBottom: 1, borderWidth: 0, borderRadius: 20, borderCurve:5 }}
                                    >
                                        <MapPinIcon size={20} color="gray" />
                                        <Text style={{ color: 'black', fontSize: 18, marginLeft: 8 }}>{loc?.name}, {loc?.country}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
             </View>       
        ):null
        }
                </View>


    {            /* forecast section */}
                <View style={{bottom:20,left:20, marginHorizontal: 10,justifyContent: 'space-around'}}>
                {/* location */}
                <Text style={{ top:80, color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold', textAlign:'center' ,right:20}}>
                    {location?.name}, 
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#D1D5DB' }}>
                    {" "+location?.country}
                    </Text>
                </Text>

                    { /* weather image */}
                    <View style={{ top: 100,flexDirection: 'row', justifyContent: 'center' ,right: 20}}>
                    <Image
                        source={current?.temp_c >= 29 ? require('../assets/sun1.png') : { uri: 'https:' + current?.condition?.icon }}
                        style={{ width: 130, height: 130 }}
                    />
                    </View>

                    { /* degree celsius */}
                    <View style={{ marginTop: 100,justifyContent: 'center',right:20 }}>
                        <Text style={{ textAlign: 'center', fontSize: 60, fontWeight: 'bold', color: 'white', marginLeft: 5 }}>
                            {current?.temp_c}&#176;
                        </Text>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: 'white', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                {current?.temp_c >= 29 ? "Sunny" : current?.condition?.text}
                        </Text>
                    </View>

                    {/* other stats */}
                    <View style={{ top: 20, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16 , right:20}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', spaceX: 2 }}>
                            <Image source={require('../assets/windl.webp')} style={{ width: 30, height: 30 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{current?.wind_kph}km</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', spaceX: 2 }}>
                            <Image source={require('../assets/drop.png')} style={{ width: 24, height: 24 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{current?.humidity}%</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', spaceX: 2 }}>
                            <Image source={require('../assets/sun.png')} style={{ width: 24, height: 24 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                                    {" "+weather?.forecast?.forecastday[0]?.astro?.sunrise}
                                </Text>
                        </View>
                    </View> 

                {/* forecast for next days */}
                <View style={{ top: 10, marginBottom: 5, marginTop: 40, paddingHorizontal: 16, right:30 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5, spaceX: 2,bottom:10 }}>
                        <CalendarDaysIcon size={22} color="white" />
                        <Text style={{ color: 'white', fontSize: 16 }}> Daily forecast</Text>
                    </View>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ paddingHorizontal: 2 }}
                        showsHorizontalScrollIndicator={false}
                        
                    >
                        {
                            weather?.forecast?.forecastday?.map((item,index) =>{
                                let date = new Date (item.date) ;
                                let options = {weekday: 'long'};
                                let dayName = date.toLocaleDateString ('en-US', options);
                                dayName = dayName.split (',') [0]
                                //console.log(dayName, item?.day?.condition?.text);
                                return(
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'column', 
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 90,
                                            height: 120,
                                            borderRadius: 20,
                                            marginLeft: 3,
                                            marginRight: 3,
                                            backgroundColor: theme.bgWhite(0.15),
                                             paddingVertical: 10,
                                            paddingHorizontal: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: 11,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {dayName}
                                        </Text>
                                        <Image
                                            source={weatherImages[item?.day?.condition?.text]}
                                            style={{
                                                width: 44,
                                                height: 44,
                                                marginTop: 5, 
                                            }}
                                        />
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                marginTop: 5, 
                                            }}
                                        >
                                            {item?.day?.avgtemp_c}&#176;
                                        </Text>
                                    </View>
                                )
                            }
                            )
                        }
                    </ScrollView>
            </View>

        <View style={{ bottom: 5,marginBottom: 5, marginTop: 40, paddingHorizontal: 16, right:30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5, spaceX: 2,bottom:10 }}>
                <CalendarDaysIcon size={22} color="white" />
                <Text style={{ color: 'white', fontSize: 16 }}> Monthly forecast</Text>
            </View>
            <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 2 }}
                showsHorizontalScrollIndicator={false}
            >
    {monthlyForecasts && monthlyForecasts.map((monthForecast, index)=> {
        const monthName = monthNames[index];
        if (!monthForecast || isNaN(monthForecast.averageTemperature)) {
            return (
                <View key={index}>
                    Loading...
                </View>
            );
        }
        return (
            <View
                key={index}
                style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 90,
                    height: 120,
                    borderRadius: 20,
                    marginLeft: 3,
                    marginRight: 3,
                    backgroundColor: theme.bgWhite(0.15),
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}
                >
                    {monthName}
                </Text>
                <Image
                    source={
                        monthForecast.averageTemperature < 26
                            ? require('../assets/rainfall.jpeg')
                            : monthForecast.averageTemperature < 29
                            ? require('../assets/partlycloudy.png')
                            : require('../assets/sun1.png')
                    }
                    style={{
                        width: 44,
                        height: 44,
                        marginTop: 5,
                    }}
                />
                <Text
                    style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginTop: 5,
                    }}
                >
                    {monthForecast.averageTemperature !== null && !isNaN(monthForecast.averageTemperature) ? monthForecast.averageTemperature.toFixed(2) + '°C' : 'Loading'}
                </Text>
            </View>
        );
    })} 
</ScrollView>

            </View>
    </View>
</SafeAreaView>

                )
            }
</View>
    );
}
