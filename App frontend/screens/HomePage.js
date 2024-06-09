import {
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Text,
} from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/index";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Nitrogen from "./Nitrogen";
import { SwipeablePanel } from "rn-swipeable-panel";
import HomeMenuItem from "../components/HomeMenuItem";
import GlobalStyles from "../styles/GlobalStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colours from "../styles/Colours";
import { useContext, useEffect, useState } from "react";
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
import { StateContext } from "./StateProvider";
import PhosScreen from "./Phosphorous";
import Potassium from "./Potassium";
import Acid from "./ph";
import Rain from "./rainfall";
import TempScreen from "./TempScreen";
import UserDetailsForm from "./UserDetailsForm";
import CropSelect from "./cropSelect";

const Stack = createNativeStackNavigator();

const HomePage = ({ navigation }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name="Home Display"
                component={HomeDisplay}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="Nitrogen"
                component={Nitrogen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="PhosScreen"
                component={PhosScreen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="Potassium"
                component={Potassium}
            />
             <Stack.Screen
                options={{ headerShown: false }}
                name="Acid"
                component={Acid}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="Rain"
                component={Rain}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="TempScreen"
                component={TempScreen}
            />
             <Stack.Screen
                options={{ headerShown: false }}
                name="UserDetailsForm"
                component={UserDetailsForm}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="CropSelect"
                component={CropSelect}
            />
        </Stack.Navigator>
    );
};

const HomeDisplay = ({ navigation }) => {
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
    const db = getFirestore(app1);
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [bellColour, setBellColour] = useState(colours.secondary);
    const [recos, setRecos] = useState([]);
    const { userID } = useContext(StateContext);
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

    const handleDelete = async (item) => {
        let arr = remove(recos, item);
        setRecos(arr);

        //Removing it from database
        let docData = {};
        docData[item.id] = deleteField();
        console.log(item);

        const recoDocRef = doc(db, "recommendations", userID);
        await updateDoc(recoDocRef, docData);
    };
    const openPanel = () => {
        setIsPanelActive(true);
    };

    const closePanel = () => {
        setIsPanelActive(false);
    };

    useEffect(async () => {
        const recoDocRef = doc(db, "recommendations", userID);
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
        <>
            <View style={GlobalStyles.header}>
                <Image
                    style={GlobalStyles.headerLogo}
                    source={require("../assets/logo.png")}
                ></Image>
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
                        }}
                        name="bell-circle-outline"
                        color={colours.secondary}
                        size={30}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={GlobalStyles.homeMainContainer}>
                    <HomeMenuItem
                        itemText={"Nitrogen"}
                        imagePath={require("../assets/nitrogen1.png")}
                        click={"Nitrogen"}
                        navigation={navigation}
                    ></HomeMenuItem>
                    <HomeMenuItem
                        itemText={"Phosphorous"}
                        imagePath={require("../assets/phos.png")}
                        click={"PhosScreen"}
                        navigation={navigation}
                    ></HomeMenuItem>
                    <HomeMenuItem
                        itemText={"Potassium"}
                        imagePath={require("../assets/potas.png")}
                        click={"Potassium"}
                        navigation={navigation}
                    ></HomeMenuItem>
                    <HomeMenuItem
                        itemText={"Weather"}
                        imagePath={require("../assets/cloud-blue-sky.jpg")}
                        click={"TempScreen"}
                        navigation={navigation}
                    ></HomeMenuItem>
                    <HomeMenuItem
                        itemText={"pH"}
                        imagePath={require("../assets/art.png")}
                        click={"Acid"}
                        navigation={navigation}
                    ></HomeMenuItem>
                    <HomeMenuItem
                        itemText={"Rainfall"}
                        imagePath={require("../assets/rainfall.jpeg")}
                        click={"Rain"}
                        navigation={navigation}
                    ></HomeMenuItem>
                </View>
            </ScrollView>
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
        </>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#228B22",
        width: 200,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
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
