import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

const IslandNav = () => {
  return (
    <Pressable style={styles.mainContainer}>
        <View style={styles.innerContainer}>
            <Text>islandNaI</Text>
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    mainContainer:{
        position: 'absolute',
        bottom: 20,
        zIndex: 999,
        width: "100%",
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainer:{
        flex: 1,
        width: "60%",
        backgroundColor: '#494F55',
        borderRadius: 80,
        elevation: 5,
        opacity: 0.9
    }
})

export default IslandNav;