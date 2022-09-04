import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import themeStyles from "../config/styles";
import Ionicons from '@expo/vector-icons/Ionicons';

const Title = ({boldTitle, NormalTitle, icon}) => {
  return (
    <View style={styles.catContainer}>
        <Ionicons name={icon} size={18} color={themeStyles.colors.accentColor} />
        <Text style={styles.catTitle}>{boldTitle} <Text style={{fontFamily: "pop-regular"}}>{NormalTitle}</Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
    catContainer:{
        marginVertical: 20,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: "center"
    },
    catTitle:{
        fontSize: 18,
        color: "#fff",
        fontFamily: "pop-medium",
        marginHorizontal: 10
    }
})

export default Title