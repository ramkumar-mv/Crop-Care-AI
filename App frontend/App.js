import { NavigationContainer } from "@react-navigation/native";
import { StateProvider } from "./screens/StateProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "./screens/Start";
import LoginScreen from "./screens/LoginScreen";
import { LogBox } from "react-native";
import Splash from "./screens/Splash";

const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <StateProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Splash"
                        component={Splash}
                        options={{
                            headerShown: false,
                            gestureEnabled: false,
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            headerShown: false,
                            gestureEnabled: false,
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="Start"
                        component={Start}
                        options={{
                            headerShown: false,
                            gestureEnabled: false,
                        }}
                    ></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </StateProvider>
    );
}

