import React from "react";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";

const HomeMenuItem = ({ imagePath, itemText, click, navigation }) => {
    return (
        <TouchableOpacity
            style={GlobalStyles.menuItemTouchableOpacity}
            onPress={() => navigation.navigate(click)}
        >
            <View style={GlobalStyles.menuItemMainView}>
                <ImageBackground
                    style={GlobalStyles.menuItemImage}
                    source={imagePath}
                    imageStyle={{ borderRadius: 20 }}
                >
                    <Text style={GlobalStyles.menuItemText}>{itemText}</Text>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );
};

export default HomeMenuItem;
