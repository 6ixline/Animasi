import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity, FlatList, Pressable, Dimensions, ImageBackground } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { getpopularAnime, getTrendingAnime } from '../utils/data'
import Ionicons from '@expo/vector-icons/Ionicons';
import Carousel from 'react-native-anchor-carousel';
import themeStyles from "../config/styles";
import { getData } from '../utils/storage';
import WatchHistory from '../component/WatchHistory';
import Title from '../component/Title';
import Card from '../component/Card';


const {width: windowWidth} = Dimensions.get('window');


const Home = ({navigation}) => {

    const [popularAnime, setPopularAnime] = useState([]);
    const [trendingAnime, setTrendingAnime] = useState([]);
    const [watchHistory, setwatchHistory] = useState([]);
    const [trackData, settrackData] = useState(true);
    const carouselRef = useRef(null);
     
    useEffect(()=>{
        let isCancelled = false;
        async function fetchAnime(){
            try {
                let data = await getpopularAnime();
                const trendingData =  await getTrendingAnime();
                setTrendingAnime(trendingData);
                setPopularAnime(data);
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

    useEffect(()=>{
        let isCancelled = false;
        async function fetchWatchHistory(){
            const watchHistoryData = await getData('recentAnimeWatch');
            if(watchHistoryData !== null && watchHistoryData[0].length > 0){
                console.log(watchHistoryData);
                setwatchHistory(watchHistoryData);
            }
        }
        if(!isCancelled){
            fetchWatchHistory();
        }

        return ()=>{
            fetchWatchHistory();
        }
    },[])

    function hanldeWatchHistory(data){
        setwatchHistory(data);
    }


    function handleAnime(id){
        navigation.navigate("Animedetails", {
            id:id,
            watchHistory: hanldeWatchHistory
        });
    }

   
    function handleSearch(){
        navigation.navigate("Search", {
            watchHistory: hanldeWatchHistory
        });
    }
    
    return (
        <>
        {
            trackData ? (
            <View style={styles.contianer}>
                <ActivityIndicator size="large" color={themeStyles.colors.accentColor} />
            </View>
            ) : 
            (

            <View style={styles.mainContainer}>
                <View style={styles.Header}>
                    <Image source={require("../assets/logo/logo.png")} style={styles.logo} />
                    <Text style={styles.title}>Animasi</Text>
                    <Pressable onPress={handleSearch} style={{paddingHorizontal: 10}}>
                        <Ionicons name="search-outline" size={28} color={themeStyles.colors.accentColor} />
                    </Pressable>
                </View>
        
                <FlatList
                data={trendingAnime}    
                renderItem={({item})=>(
                    <Card item={item} animeHandle={handleAnime} cardStyle={styles.cardBody} />
                )}
                keyExtractor={(item)=> item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <Carousel
                            ref={carouselRef}
                            data={popularAnime}
                            renderItem={({item})=>{
                            return (
                                
                                <TouchableOpacity style={styles.carouselSlide} onPress={()=>handleAnime(item.id)}>
                                    {item.cover?.includes("banner") && <ImageBackground source={{uri: item.cover}} style={styles.carsoulPoster}>
                                        <Text style={styles.carsoulTitle}>{item.title.english != "" ? item.title.english : item.title.romaji}</Text>
                                    </ImageBackground>}
                                </TouchableOpacity>
                            )}}
                            style={styles.carousel}
                            itemWidth={0.9 * windowWidth}
                            containerWidth={windowWidth}
                            separatorWidth={10}
                        />
                     
                        {watchHistory.length > 0 && <WatchHistory data={watchHistory} animeHandle= {handleAnime} /> }
                        
                        <Title boldTitle="Top" NormalTitle="Airing Anime" icon="apps-outline" />
                    </>
                }
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
        backgroundColor: "#000"
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#000"

    },
    Header:{
        marginTop: 60,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    logo:{
        width: 40,
        height: 40,
        borderRadius: 5
    },
    title:{
        flex: 1,
        textAlign: "center",
        fontSize: 28,
        fontFamily: "lob-bold",
        color: themeStyles.colors.accentColor,
        marginBottom: 10
    },
    cardBody:{
        marginHorizontal: 8,
        width: "30%",
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
        fontFamily: "pop-medium",
        padding: 5,
        color: "#fff"
    },
    titleBack:{
        backgroundColor: "#000",
        height: "100%",
        width: "100%",
        position: 'absolute',
        opacity: .2,
        bottom: 0,
    },
    carousel: {
        flexGrow: 1,
        height: 250,
        marginTop: 10
    },
    carouselSlide:{
        width: "100%",
        maxHeight: 220,
        elevation: 4,
        borderRadius: 10,
    },
    carsoulPoster:{
        height: "100%",
        position: 'relative',
        width: "100%",
        borderRadius: 10,
        overflow: 'hidden',
    },
    carsoulTitle:{
        fontSize: 14,
        fontFamily: "pop-medium",
        color: '#fff',
        position: 'absolute',
        bottom: 10,
        marginHorizontal: 10
    },
   
})

export default Home