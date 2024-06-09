import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app1 } from "../firebase";
import { StateContext } from "./StateProvider";
import { Image } from 'react-native';
import { Alert } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';
import colours from '../styles/Colours';
import { SwipeablePanel } from 'rn-swipeable-panel';
import {
    getDoc,
    increment,
    updateDoc,
    deleteField,
} from "firebase/firestore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CropSelect = () => {
    const [Crop, setCrop] = useState('');
    const { userID } = useContext(StateContext);
    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: false,
        onlySmall: true,
        showCloseButton: false,
        smallPanelHeight: 700,
        closeOnTouchOutside: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
    });
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [bellColour, setBellColour] = useState(colours.secondary);
    const [recos, setRecos] = useState([]);
    const remove = (arr, val) => {
        // Remove from the breakfastList
        let array = [...arr];
        let len = array.length;
        let index;
        for (let i = 0; i < len; i++) {
            if (array[i] == val) {
                index = i;
            }
        }
        array.splice(index, 1);
        return array;
        // Add back to the array
    };


    const db = getFirestore(app1); 

    const openPanel = () => {
        setIsPanelActive(true);
    };

    const closePanel = () => {
        setIsPanelActive(false);
    };

    const handleDelete = async (item) => {
        let arr = remove(recos, item);
        setRecos(arr);

        //Removing it from database
        let docData = {};
        docData[item.id] = deleteField();
        console.log(item);

        const recoDocRef = doc(db, "predictions", userID);
        await updateDoc(recoDocRef, docData);
    };

    const handleSubmit = async () => {
        try {
            // Check if region and crop values are valid
            const validCrops = ['Rice', 'Wheat', 'Maize', 'Cotton'];
    
            if (!validCrops.includes(Crop)) {
                Alert.alert('Error', 'Please enter valid crop values.');
                return;
            }
    
            // Update cropTotals
            const cropRef = doc(db, `details/${userID}/Totals/cropConfirm`);
            let cropValue = validCrops.indexOf(Crop) + 1;
            await setDoc(cropRef, { total: cropValue, value: Crop });
    
            Alert.alert('Success', 'Submitted successfully.');
            console.log('Submitted successfully.');
            // Optionally, you can reset the form fields after submission
            setCrop('');
        } catch (error) {
            console.error('Error submitting user details:', error);
        }
    };

    useEffect(async () => {
        const recoDocRef = doc(db, "predictions", userID);
        const recoDocSnap = await getDoc(recoDocRef);

        if (!recoDocSnap.exists()) {
            await setDoc(recoDocRef, {});
        } else {
            let info = recoDocSnap.data();
            let result = [];

            for (const key in info) {
                const item = {
                    id: key,
                    reco: info[key],
                };
                if (key != "counter") {
                    result.push(item);
                }
            }
            if (result.length > 0) {
                setBellColour(colours.alert);
            }
            setRecos(result.reverse());
        }
    }, []);

    return (
        <View style={styles.container}>
            <Image
                blurRadius={70}
                source={require('../assets/bg1.jpg')}
                style={{ position: 'absolute', height: '100%', width: '100%' }}
            />
            <TouchableOpacity
                    style={GlobalStyles.headerBell}
                    onPress={openPanel}
                >
                    <MaterialCommunityIcons
                        style={{
                            shadowColor: bellColour,
                            shadowOffset: { width: -2, height: 2 },
                            shadowOpacity:
                                bellColour == colours.secondary ? 0 : 1,
                            shadowRadius: 3,
                            bottom:20,
                        }}
                        name="bell-circle-outline"
                        color="blue"
                        size={30}
                    />
                </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Crop Confirmation"
                value={Crop}
                onChangeText={setCrop}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text>Submit</Text>
            </TouchableOpacity>
            <SwipeablePanel {...panelProps} isActive={isPanelActive}>
                <View style={{ marginBottom: 20 }}>
                    {recos.map((item) => (
                        <View style={styles.tableList}>
                            <View style={styles.wrapper}>
                                <Text style={styles.row3}>{item.reco}</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(item)}
                                >
                                    <MaterialCommunityIcons
                                        name="delete"
                                        color={colours.white}
                                        size={20}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </SwipeablePanel> 
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
    deleteButton: {
        backgroundColor: colours.darkGrey,
        width: 25,
        height: 25,
        marginTop: 6,
        borderRadius: 50,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },

    title: {
        marginTop: 20,
        fontSize: 20,
        alignSelf: "center",
        fontWeight: "bold",
        marginBottom: 10,
    },

    floatingActionButton: {
        backgroundColor: colours.main,
        width: 300,
        height: 60,
        bottom: 30,
        borderRadius: 100,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        flexDirection: "row",
    },
    tableList: {
        width: "95%",
        alignSelf: "center",
    },

    wrapper: {
        flexDirection: "row",
        backgroundColor: colours.pale,
        marginVertical: 2,
        borderRadius: 5,
    },

    row3: {
        width: "100%",
        flex: 1,
        fontSize: 12,
        padding: 5,
        alignItems: "center",
    },
});

export default CropSelect;
