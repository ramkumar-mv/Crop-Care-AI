import React, { useEffect, useState, useContext } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { app1 } from "../firebase";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import { StateContext } from "./StateProvider";
import colours from "../styles/Colours";

const LoginScreen = ({ navigation }) => {
    const { setUserID } = useContext(StateContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth(app1);
    const db = getFirestore(app1);
    useEffect(async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserID(user.uid);
                console.log("Logged in with UID: " + user.uid);
                navigation.navigate("Start");
            }
        });
    }, []);

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email.trim(), password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Registered with:", user.email);
                const accountDocRef = doc(db, "userInfo", user.uid);
                setDoc(accountDocRef, {});
            })
            .catch((error) => alert(error.message));
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email.trim(), password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Logged in with: ", user.email);
            })
            .catch((error) => alert(error.message));
    };

    return (
        <View style={styles.container}>
            <Image
                blurRadius={70}
                source={require('../assets/bg.png')}
                style={StyleSheet.absoluteFillObject} 
            />
            <Image
                style={{
                    bottom:50,
                    width: 300,
                    height: 300, // Set the height as well
                    resizeMode: 'contain',
                    marginBottom: 50, // Adjust the margin as needed
                }}
                source={require("../assets/logo.png")}
            ></Image>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="username@gmail.com"
                    placeholderTextColor={colours.darkGrey}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    keyboardType={"email-address"}
                    returnKeyType={"next"}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="●●●●●●●●"
                    placeholderTextColor={colours.darkGrey}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    returnKeyType={"done"}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={{
                        height: 70,
                        backgroundColor: colours.secondary,
                        paddingHorizontal: 25,
                        borderRadius: 100,
                        marginVertical: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 50,
                    }}
                >
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={handleSignUp}
                style={{
                    height: 50,
                    alignContent: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    marginTop: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: colours.darkGrey,
                    }}
                >
                    Don't have an account?{" "}
                    <Text
                        style={{
                            color: colours.secondary,
                        }}
                    >
                        Sign Up!
                    </Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    inputContainer: {
        width: "80%",
        marginTop: -60,
        bottom: 60,
    },

    input: {
        height: 70,
        backgroundColor: "white",
        paddingHorizontal: 25,
        borderRadius: 100,
        marginVertical: 8,
    },

    buttonContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },

    button: {
        backgroundColor: "#228B22",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontWeight: "500",
        fontSize: 20,
    },

    buttonOutline: {
        backgroundColor: "white",
        marginTop: 5,
        borderColor: "#228B22",
        borderWidth: 2,
    },

    buttonOutlineText: {
        color: "#228B22",
        fontWeight: "700",
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
