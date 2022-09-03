import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity, FlatList, Pressable, Dimensions, ImageBackground } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { topAiring, recentEpisode } from '../utils/data'
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from "expo-linear-gradient";
import Carousel from 'react-native-anchor-carousel';


const {width: windowWidth} = Dimensions.get('window');


const Home = ({navigation}) => {

    const [topAiringAnime, setTopAiringAnime] = useState([]);
    const [recentAnime, setRecentAnime] = useState([]);
    const [trackData, settrackData] = useState(true);
    const carouselRef = useRef(null);
     
    useEffect(()=>{
        let isCancelled = false;
        async function fetchAnime(){
            try {
                let data = await topAiring();
                const recentData =  await recentEpisode();
                setRecentAnime(recentData);
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
                <Carousel
                    ref={carouselRef}
                    data={recentAnime}
                    renderItem={({item})=>(
                        <TouchableOpacity style={styles.carouselSlide} onPress={()=>handleAnime(item.id)}>
                            <ImageBackground source={{uri: item.image}} style={styles.carsoulPoster}>
                                <Text style={styles.carsoulTitle}>{item.title}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                    style={styles.carousel}
                    itemWidth={0.8 * windowWidth}
                    containerWidth={windowWidth}
                    separatorWidth={10}
                />
                

                <View style={styles.catContainer}>
                    <Ionicons name="apps-outline" size={28} color="black" />
                    <Text style={styles.catTitle}>Top Airing Anime</Text>
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
        borderColor: "#d8d8d8",
        paddingBottom: 18,
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingHorizontal: 10
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
    },
    carousel: {
        flexGrow: 1,
        height: 250
    },
    carouselSlide:{
        width: "100%",
        elevation: 4,
        borderRadius: 10,
    },
    carsoulPoster:{
        height: "100%",
        position: 'relative',
        width: "100%",
        borderRadius: 10,
        overflow: 'hidden'
    },
    carsoulTitle:{
        fontSize: 14,
        fontWeight: "bold",
        color: '#fff',
        position: 'absolute',
        bottom: 10,
        marginHorizontal: 10
    },
    catContainer:{
        marginVertical: 20,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: "center"

    },
    catTitle:{
        fontWeight: "bold",
        fontSize: 16,
        marginHorizontal: 10
    }

})

export default Home