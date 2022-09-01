import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity, FlatList, Pressable } from 'react-native'
import React, {useEffect, useState} from 'react'
import { topAiring } from '../utils/data'
import Ionicons from '@expo/vector-icons/Ionicons';


const Home = ({navigation}) => {

    const [topAiringAnime, setTopAiringAnime] = useState([]);
    const [trackData, settrackData] = useState(true);
     
    useEffect(()=>{
        let isCancelled = false;
        async function fetchAnime(){
            try {
                let data = await topAiring();
                setTopAiringAnime(data);
                settrackData(false);
            } catch (error) {
                console.log(error)
            }
            
        }

        if(!isCancelled){
            fetchAnime();
        }

        return ()=>{
            isCancelled = true;
        }
    },[])


    function handleAnime(id){
        navigation.navigate("Animedetails", {
            id:id
        });
    }

    function handleSearch(){
        navigation.navigate("Search");
    }

    return (

        <>
        {
            trackData ? (
            <View style={styles.contianer}>
                <ActivityIndicator size="large" />
            </View>
            ) : 
            (

            <View style={styles.mainContainer}>
                <View style={styles.Header}>
                    <Text style={styles.title}>Animasi</Text>
                    <Pressable onPress={handleSearch}>
                        <Ionicons name="search-outline" size={28} color="black" />
                    </Pressable>
                </View>
                <FlatList
                data={topAiringAnime}    
                renderItem={({item})=>(
                    <TouchableOpacity style={styles.cardBody} onPress={()=>handleAnime(item.id)}>
                        <Image style={styles.cardImage} source={{uri: item.image}}/>
                        <Text style={styles.cardTitle}>{`${item.title.substr(0, 20)}...`}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item)=> item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                />
            </View>
            )
        }
        </>
        
    )
}


const styles = StyleSheet.create({
    contianer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    mainContainer: {
        flex: 1,
    },
    Header:{
        marginTop: 60,
        borderBottomWidth: 1,
        borderColor: "#d8d8d8",
        paddingBottom: 18,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        marginHorizontal: 20
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
    },
    cardBody:{
        marginHorizontal: 10,
        width: "28%",
        elevation: 4,
        marginVertical: 5
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
        fontWeight: "bold",
        padding: 5
    }
})

export default Home