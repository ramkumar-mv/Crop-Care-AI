import React, { useEffect, useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signOut } from "firebase/auth";
import { StateContext } from "./StateProvider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colours from "../styles/Colours";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app1 } from "../firebase";
import { getAuth } from "firebase/auth";

const Profile = ({ navigation }) => {
    const { setUserID, setFoodItems, setTransportItems, userID } =
        useContext(StateContext);
    const [username, setUsername] = useState('');
    const auth = getAuth(app1);

    const db = getFirestore(app1);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const userDoc = await getDoc(doc(db, `details/${userID}`));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.Name || 'Unknown');
                } else {
                    setUsername('Unknown');
                }
            } catch (error) {
                console.error('Error fetching username:', error);
                setUsername('Unknown');
            }
        };

        fetchUsername();
    }, [userID]); 

    const handleUserInformation = () => {
        console.log({username})
        navigation.navigate('UserDetailsForm');
    };

    const handleCropSelection = () => { 
        console.log({username})
        navigation.navigate('CropSelect');
    };
  
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Reset all the states
                setUserID("");
                setFoodItems([]);
                setTransportItems([]);
                navigation.popToTop();
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Image
                blurRadius={70}
                source={require('../assets/bg2.jpg')}
                style={{ position: 'absolute', height: '100%', width: '100%' }}
            />
            <MaterialCommunityIcons
                name="account-circle"
                color={colours.white}
                size={150}
            />
            <Text style={{ color: "white",paddingBottom: 150,fontSize:20 }}>Username: {username}</Text>
            <TouchableOpacity onPress={handleUserInformation} style={styles.button}>
                <Text style={styles.buttonText}>User Information</Text>
                <MaterialCommunityIcons
                    name="account-check"
                    color={colours.white}
                    size={30}
                    style={{ paddingLeft: 10 }}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCropSelection} style={styles.button}>
                <Text style={styles.buttonText}>Confirm Crop Selection</Text>
                <MaterialCommunityIcons
                    name="feature-search"
                    color={colours.white}
                    size={30}
                    style={{ paddingLeft: 10 }}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
                <MaterialCommunityIcons
                    name="logout-variant"
                    color={colours.white}
                    size={30}
                    style={{ paddingLeft: 10 }}
                />

            </TouchableOpacity>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: "#000000",
        width: 200,
        padding: 15,
        marginTop: 20,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonText: {
        color: colours.white,
        fontWeight: "700",
        fontSize: 16,
    },
});
