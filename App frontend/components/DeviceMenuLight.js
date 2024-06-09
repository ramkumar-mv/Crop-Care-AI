import { useEffect, useState } from "react";
import {
    View,
    Switch,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
} from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/index";
import server from "../constants/api";
import GlobalStyles from "../styles/GlobalStyles";
import colours from "../styles/Colours";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    doc,
    getFirestore,
    getDoc,
    setDoc,
    increment,
    updateDoc,
    deleteField,
} from "firebase/firestore";
import { app } from "../firebase";

const DeviceMenuLight = ({
    lightText,
    switchValue,
    switchValueSet,
    roomNum,
}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [paused, setPaused] = useState(true);
    const [weekdayOn, setWeekdayOn] = useState(false);
    const [weekdayOff, setWeekdayOff] = useState(false);
    const [weekendOn, setWeekendOn] = useState(false);
    const [weekendOff, setWeekendOff] = useState(false);
    const db = getFirestore(app);
    const [which, setWhich] = useState();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = async (date) => {
        date = new Date(date);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (minutes == 0) {
            minutes = "00";
        }
        let timeString = hours + ":" + minutes;

        console.log(timeString);

        if (which == 1) {
            fetch(server.base + server.weekdayOn(roomNum, timeString))
                .then((res) => res.json())
                .then((value) => console.log(value))
                .catch((err) => console.error(err));
            setWeekdayOn(timeString);
        } else if (which == 2) {
            fetch(server.base + server.weekdayOff(roomNum, timeString))
                .then((res) => res.json())
                .then((value) => console.log(value))
                .catch((err) => console.error(err));
            setWeekdayOff(timeString);
        } else if (which == 3) {
            fetch(server.base + server.weekendOn(roomNum, timeString))
                .then((res) => res.json())
                .then((value) => console.log(value))
                .catch((err) => console.error(err));
            setWeekendOn(timeString);
        } else if (which == 4) {
            fetch(server.base + server.weekendOff(roomNum, timeString))
                .then((res) => res.json())
                .then((value) => console.log(value))
                .catch((err) => console.error(err));
            setWeekendOff(timeString);
        }

        hideDatePicker();
    };

    const lightSwitchHandler = () => {
        switchValueSet(!switchValue);
        let status = switchValue ? "off" : "on";
        fetch(server.base + server.turnOnLight(roomNum, status))
            .then((res) => res.json())
            .then((value) => console.log(value))
            .catch((err) => console.error(err));
    };

    const schedulerHandler = () => {
        setPaused(!paused);
        let status = paused ? "on" : "off";

        if (status == "on") {
            fetch(server.base + server.resume(roomNum))
                .then((res) => res.json())
                .then((value) => console.log(value))
                .catch((err) => console.error(err));
        } else {
            fetch(server.base + server.pause(roomNum))
                .then((res) => res.json())
                .then((value) => console.log(value))
                .catch((err) => console.error(err));
        }
    };

    useEffect(async () => {
        const schedulerRef = doc(db, `scheduler/`, roomNum);
        const schedulerSnap = await getDoc(schedulerRef);

        let info = schedulerSnap.data();
        setWeekdayOn(info["weekdayOn"]);
        setWeekdayOff(info["weekdayOff"]);
        setWeekendOn(info["weekendOn"]);
        setWeekendOff(info["weekendOff"]);
        setPaused(info["paused"]);
    }, []);

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                width: "92%",
                height: 160,
                padding: 20,
                borderRadius: 10,
                marginTop: 20,
                backgroundColor: colours.white,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: colours.grey,
                    marginBottom: 10,
                }}
            >
                <MaterialCommunityIcons
                    name="lightbulb-on-outline"
                    color={colours.main}
                    size={30}
                    style={{
                        flex: 1,
                    }}
                />

                <View style={{ flex: 3 }}>
                    <Text style={{ ...FONTS.h2 }}>Light</Text>
                    <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>
                        {lightText}
                    </Text>
                </View>

                <Switch
                    trackColor={{
                        true: colours.secondary,
                        false: colours.grey,
                    }}
                    value={switchValue}
                    onValueChange={lightSwitchHandler}
                    style={{ flex: 1 }}
                />
            </View>

            <View
                style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <MaterialCommunityIcons
                    name="clock-outline"
                    color={colours.main}
                    size={30}
                    style={{
                        flex: 1,
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 10,
                        marginLeft: -20,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Weekdays</Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                showDatePicker();
                                setWhich(1);
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: colours.secondary,
                                }}
                            >
                                {weekdayOn}
                            </Text>
                        </TouchableOpacity>
                        <Text> - </Text>
                        <TouchableOpacity
                            onPress={() => {
                                showDatePicker();
                                setWhich(2);
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: colours.secondary,
                                }}
                            >
                                {weekdayOff}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 10,
                        marginRight: 10,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Weekends</Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                showDatePicker();
                                setWhich(3);
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: colours.secondary,
                                }}
                            >
                                {weekendOn}
                            </Text>
                        </TouchableOpacity>
                        <Text> - </Text>
                        <TouchableOpacity
                            onPress={() => {
                                showDatePicker();
                                setWhich(4);
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: colours.secondary,
                                }}
                            >
                                {weekendOff}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Switch
                    trackColor={{
                        true: colours.secondary,
                        false: colours.grey,
                    }}
                    value={!paused}
                    onValueChange={schedulerHandler}
                    style={{ flex: 1, marginRight: -18 }}
                />
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                locale="en_GB"
                date={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

export default DeviceMenuLight;
