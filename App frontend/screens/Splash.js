import { useEffect, useContext } from "react";
import { View, Image } from "react-native";
import { app1 } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StateContext } from "./StateProvider";
import GlobalStyles from "../styles/GlobalStyles";
import Colours from "../styles/Colours";

const Splash = ({ navigation }) => {
    const { userID, setUserID, colours } = useContext(StateContext);
    const auth = getAuth(app1);

    useEffect(() => {
        let navigateTo;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserID(user.uid);
                console.log("Logged in with UID: " + user.uid);
                navigateTo = "Start";
            } else {
                navigateTo = "Login";
            }
            setTimeout(() => {
                navigation.navigate(navigateTo);
            }, 1000);
        });
    }, []);
        <View style={GlobalStyles.background}>
            <View style={GlobalStyles.logoImageView}>
                <Image
                    style={GlobalStyles.logoImage}
                    source={require(".././assets/logo.png")}
                />
            </View>
        </View>
};

export default Splash;
