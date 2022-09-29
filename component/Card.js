import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'

const Card = ({item, animeHandle, cardStyle}) => {

  return (
    <TouchableOpacity style={[styles.watchcardBody, cardStyle]} onPress={()=>animeHandle(item.id)}>
        <Image style={styles.cardImage} source={{uri: item.image}}/>
        <Text style={styles.cardTitle}>{`${item.title.english != "" ? item.title.english?.substr(0,12) : item.title.romaji?.substr(0,12)}`}{item.title.english?.length > 12 && "..."}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    watchcardBody:{
        marginHorizontal: 8,
        elevation: 4,
        width: 120
    },
    cardImage:{
        width: "100%",
        height: 120,
        borderRadius: 10,
    },
    cardTitle:{
        margin: 2,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: "pop-medium",
        padding: 5,
        color: "#fff",
    },
})

export default Card