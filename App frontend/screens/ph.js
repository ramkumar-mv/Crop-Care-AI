import { useEffect, useContext, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TextInput
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
import { SwipeablePanel } from "rn-swipeable-panel";
import colours from "../styles/Colours";
import ProgressCircle from "react-native-progress-circle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DropDownPicker from "react-native-dropdown-picker";

const getDateString = (date) => {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var year = date.getFullYear();

    return year + "-" + month + "-" + day;
};

const Acid = ({ navigation }) => {
    const { foodItems, setFoodItems, userID, acidAmount } =
        useContext(StateContext);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [currDate, setCurrDate] = useState(new Date());
    const [items, setItems] = useState([
        { label: "pH", value: "pH" },
        
    ]);
    const [dateString, setDateString] = useState();
    const db = getFirestore(app1);
    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: false,
        onlySmall: true,
        showCloseButton: false,
        smallPanelHeight: 700,
        closeOnTouchOutside: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        scrollViewProps: { scrollEnabled: false },
    });
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [serving, setServing] = useState(0);
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [total, setTotal] = useState(0);

    const openPanel = () => {
        setIsPanelActive(true);
    };

    const closePanel = () => {
        setIsPanelActive(false);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const addItem = async () => {
        if (value != null && serving > 0) {
            let docData = {
            };
            docData[value] = serving;

            let item = {
                type: value,
                servings: serving,
            };

            let found = false;
            foodItems.forEach((itemIn) => {
                if (itemIn.type == item.type) {
                    found = true;
                }
            });

            if (!found) {
                let result = acidAmount[item.type][1] * item.servings;
                setTotal(total + result);

                docData["total"] = increment(result);

                const dayDocRef = doc(
                    db,
                    `userInfo/${userID}/pHTotals`,
                    dateString
                );
                await updateDoc(dayDocRef, docData);

                setFoodItems((foodItems) => [...foodItems, item]);

                toggleOverlay();
                setServing(0);
                setValue(null);
                toggleOverlay();
            } else {
                alert("Item already added");
            }
        } else if (value == null) {
            alert("Please select an item");
        } else if (serving == 0) {
            alert("Please select an amount");
        }
    };

    const remove = (arr, val) => {
        // Remove from the breakfastList
        let array = [...arr];
        let len = array.length;
        let index;
        for (let i = 0; i < len; i++) {
            if (array[i].type == val) {
                index = i;
            }
        }
        array.splice(index, 1);
        return array;

        // Add back to the array
    };

    const handleDelete = async (item) => {
        let arr = remove(foodItems, item.type);
        setFoodItems(arr);

        let result = acidAmount[item.type][1] * item.servings * -1;
        setTotal(total + result);

        //Removing it from database
        let docData = {};
        docData[item.type] = deleteField(result);
        docData["total"] = increment(result);

        

        const dayDocRef = doc(db, `userInfo/${userID}/pHTotals`, dateString);
        await updateDoc(dayDocRef, docData);
    };

    const handleConfirm = async (date) => {
        var conversion = getDateString(date);
        setDateString(conversion);

        const dayDocRef = doc(db, `userInfo/${userID}/pHTotals`, conversion);
        const dayDocSnap = await getDoc(dayDocRef);

        // SEE IF TODAY IS IN DB
        if (!dayDocSnap.exists()) {
            await setDoc(dayDocRef, { total: 0 });
            setTotal(0);
        } else {
            let info = dayDocSnap.data();
            setTotal(info["total"]);
            let result = [];
            for (const key in info) {
                const item = {
                    type: key,
                    servings: info[key],
                };
                if (key != "total") {
                    result.push(item);
                }
            }
            setFoodItems(result);
        }
        setCurrDate(date);
        hideDatePicker();
    };

    useEffect(async () => {
        const todayDate = getDateString(currDate);
        setDateString(todayDate);

        const dayDocRef = doc(db, `userInfo/${userID}/pHTotals`, todayDate);
        const dayDocSnap = await getDoc(dayDocRef);

        // SEE IF TODAY IS IN DB
        if (!dayDocSnap.exists()) {
            await setDoc(dayDocRef, { total: 0 });
        } else {
            let info = dayDocSnap.data();
            setTotal(info["total"]);
            let result = [];
            for (const key in info) {
                const item = {
                    type: key,
                    servings: info[key],
                };
                if (key != "total") {
                    result.push(item);
                }
            }
            setFoodItems(result);
        }
    }, []);

    const screenHeight = Dimensions.get("screen").height - 80;
    return (
        <>
            <View
                style={{
                    height: screenHeight,
                    alignItems: "center",
                    zIndex: 0,
                    backgroundColor: colours.main,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        marginTop: 220,
                        width: 800,
                        height: "100%",
                        backgroundColor: colours.white,
                        borderRadius: 500,
                    }}
                ></View>
                <TouchableOpacity
                    onPress={showDatePicker}
                    style={{
                        marginTop: 60,
                        padding: 10,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: colours.secondary,
                        }}
                    >
                        {dateString} ▼
                    </Text>
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                    <ProgressCircle
                        percent={(total/14)*100}
                        radius={100}
                        borderWidth={15}
                        color={colours.secondary}
                        shadowColor={colours.pale}
                        bgColor={colours.white}
                    >
                        <Text style={{ fontSize: 20 }}>{total} </Text>
                    </ProgressCircle>
                </View>
                <Text
                    style={{
                        textAlign: "center",
                        paddingTop: 15,
                        marginTop: 15,
                        color: colours.main,
                        fontSize: 20,
                        fontWeight: "bold",
                    }}
                >
                    Values (in the soil)
                </Text>
                <ScrollView
                    horizontal={true}
                    style={{ width: "100%" }}
                    showsHorizontalScrollIndicator={false}
                >
                    {Object.keys(acidAmount).map((item) => (
                        <TouchableOpacity>
                            <View
                                style={{
                                    marginTop: 20,
                                    marginHorizontal: 5,
                                    width: 150,
                                    height: 220,
                                    backgroundColor: colours.pale,
                                    borderRadius: 20,
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        paddingTop: 15,
                                        paddingBottom: 10,
                                        color: colours.main,
                                        fontSize: 15,
                                        fontWeight: "500",
                                    }}
                                >
                                    {item.toUpperCase()}
                                </Text>
                                <Image
                                    style={{
                                        width: 120,
                                        height: 120,
                                        marginTop: 5,
                                        borderRadius: 60,
                                        alignItems: "center",
                                        borderColor: colours.white,
                                        borderWidth: 6,
                                    }}
                                    source={acidAmount[item][0]}
                                ></Image>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginTop: 10,
                                    }}
                                >
                                    {/*<MaterialCommunityIcons
                                        name="molecule-co2"
                                        color={colours.main}
                                        size={30}
                                        style={{ marginTop: 2 }}
                                    /> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={currDate}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            /> 
            <SwipeablePanel {...panelProps} isActive={isPanelActive}>
    <Text
        style={{
            fontSize: 24,
            fontWeight: "bold",
            marginLeft: 15,
            marginVertical: 20,
        }}
    >
        pH
    </Text>
    <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={{
            width: "95%",
            alignSelf: "center",
        }}
        style={{
            borderColor: "transparent",
            backgroundColor: colours.grey,
        }}
        dropDownContainerStyle={{
            backgroundColor: "#dfdfdf",
            borderColor: "transparent",
        }}
    />
    <Text
        style={{
            fontSize: 24,
            fontWeight: "bold",
            marginLeft: 15,
            marginVertical: 20,
        }}
    >
        Values
    </Text>

    <View
        style={{
            flexDirection: "row",
            paddingBottom: 10,
            shadowColor: colours.black,
            shadowOffset: { width: -1, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            marginHorizontal: 10,
        }}
    >
        <View style={{ flex: 1 }}>
            <TextInput
                style={{
                    height: 55,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    fontSize: 20,
                }}
                keyboardType="numeric"
                placeholder="Enter value"
                value={serving.toString()}
                onChangeText={(text) => setServing(parseFloat(text))}
            />
        </View>
        <TouchableOpacity
            style={{
                backgroundColor: colours.main,
                height: 55,
                borderRadius: 10,
                alignItems: "center",
                marginLeft: 10,
                justifyContent: "center",
                flex: 1,
            }}
            onPress={addItem}
        >
            <Text style={{ fontSize: 16, color: colours.white }}>
                Submit
            </Text>
        </TouchableOpacity>
    </View>

    <Text
        style={{
            fontSize: 24,
            fontWeight: "bold",
            marginLeft: 15,
            marginTop: 40,
            marginBottom: 10,
        }}
    >
        pH Value on this date
    </Text>
    <View style={{ marginBottom: 20 }}>
        {foodItems.map((item) => (
            <View style={styles.tableList}>
                <View style={styles.wrapper}>
                    <Text style={styles.row2}> {item.type} </Text>
                    <Text style={styles.row3}>{item.servings}</Text>
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
  

            <TouchableOpacity
                style={styles.floatingActionButton}
                onPress={openPanel}
            >
                <Text
                    style={{
                        fontWeight: "bold",
                        color: colours.white,
                        fontSize: 18,
                        marginRight: 10,
                    }}
                >
                    History
                </Text>
                <MaterialCommunityIcons
                    name="history"
                    color={colours.white}
                    size={40}
                />
            </TouchableOpacity>
        </>
    );
};

export default Acid;

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

    row1: {
        width: "100%",
        flex: 1,
        fontSize: 15,
        paddingHorizontal: 2,
        paddingVertical: 10,
        alignItems: "center",
        fontWeight: "bold",
    },

    row2: {
        width: "100%",
        flex: 1,
        fontSize: 15,
        paddingHorizontal: 2,
        paddingVertical: 10,
        alignItems: "center",
    },

    row3: {
        width: "100%",
        flex: 1,
        fontSize: 15,
        paddingHorizontal: 2,
        paddingVertical: 10,
        marginLeft: 70,
        alignItems: "center",
    },
});
