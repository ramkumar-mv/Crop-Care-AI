import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./HomePage";
import { Text, View, Image } from "react-native";
import Profile from "./Profile";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colours from "../styles/Colours";

const Tabs = createBottomTabNavigator();

const Start = ({ navigation }) => {
    return (
        <Tabs.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    height: 80,
                    paddingBottom: 20,
                },
            }}
        >
            <Tabs.Screen
                name="Home"
                component={HomePage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                top: 5,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="home"
                                color={
                                    focused ? colours.secondary : colours.grey
                                }
                                size={35}
                            />
                            <Text
                                style={{
                                    color: focused
                                        ? colours.secondary
                                        : colours.grey,
                                    fontSize: 10,
                                }}
                            >
                                Home
                            </Text>
                        </View>
                    ),
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                top: 5,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="account-circle"
                                color={
                                    focused ? colours.secondary : colours.grey
                                }
                                size={35}
                            />
                            <Text
                                style={{
                                    color: focused
                                        ? colours.secondary
                                        : colours.grey,
                                    fontSize: 10,
                                }}
                            >
                                Profile
                            </Text>
                        </View>
                    ),
                }}
            />
        </Tabs.Navigator>
    );
};

export default Start;
