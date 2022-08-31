import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { topAiring } from '../utils/data'

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
                console.log(topAiringAnime[0])
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
                numColumns={2}
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
        marginBottom: 10
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 20
    },
    cardBody:{
        marginHorizontal: 10,
        width: 190,
        elevation: 4,
        marginVertical: 5
    },
    cardImage:{
        width: "100%",
        height: 250,
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