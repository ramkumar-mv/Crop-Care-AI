import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app1 } from "../firebase";
import { StateContext } from "./StateProvider";
import { Image } from 'react-native';
import { Alert } from 'react-native';

const UserDetailsForm = () => {
    const [Name, setName] = useState('');
    const [Region, setRegion] = useState('');
    const [Area, setArea] = useState('');
    const [Crop, setCrop] = useState('');
    const { userID } = useContext(StateContext);

    const db = getFirestore(app1);

    const handleSubmit = async () => {
        try {
            // Check if region and crop values are valid
            const validRegions = ['North', 'South', 'West', 'East'];
            const validCrops = ['Rice', 'Wheat', 'Maize', 'Cotton'];
    
            if (!validRegions.includes(Region) || !validCrops.includes(Crop)) {
                Alert.alert('Error', 'Please enter valid region and crop values.');
                return;
            }
    
            // Update user details
            const userDetailsRef = doc(db, `details/${userID}`);
            await setDoc(userDetailsRef, {
                Name,
                Region,
                Area,
                Crop
            });
    
            // Update regionTotals
            const regionRef = doc(db, `details/${userID}/Totals/regionTotals`);
            let regionValue = validRegions.indexOf(Region) + 1;
            await setDoc(regionRef, { total: regionValue, value: Region });
    
            // Update areaTotals
            const areaRef = doc(db, `details/${userID}/Totals/areaTotals`);
            await setDoc(areaRef, { total: Area });
    
            // Update cropTotals
            const cropRef = doc(db, `details/${userID}/Totals/cropTotals`);
            let cropValue = validCrops.indexOf(Crop) + 1;
            await setDoc(cropRef, { total: cropValue, value: Crop });
    
            Alert.alert('Success', 'User details submitted successfully.');
            console.log('User details submitted successfully.');
            // Optionally, you can reset the form fields after submission
            setName('');
            setRegion('');
            setArea('');
            setCrop('');
        } catch (error) {
            console.error('Error submitting user details:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                blurRadius={70}
                source={require('../assets/bg1.jpg')}
                style={{ position: 'absolute', height: '100%', width: '100%' }}
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={Name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Region"
                value={Region}
                onChangeText={setRegion}
            />
            <TextInput
                style={styles.input}
                placeholder="Area"
                value={Area}
                onChangeText={setArea}
            />
            <TextInput
                style={styles.input}
                placeholder="Crop"
                value={Crop}
                onChangeText={setCrop}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        color: "black",
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    button: {
        width: '80%',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'lightblue',
        borderRadius: 5,
    },
});

export default UserDetailsForm;
