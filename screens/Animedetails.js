import { View, Text, ImageBackground, ActivityIndicator, Image, StyleSheet, FlatList, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAnimeInfo } from '../utils/data';
import themeStyles from "../config/styles";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { storeData, getData } from '../utils/storage';


const Animedetails = ({route, navigation}) => {

  const [animeDetails, setAnimeDetails] = useState([]);
  const [checkData, setcheckData] = useState(true);
  const [episodeLists, setepisodeList] = useState([]);
  const [recentAnimeList, setrecentAnimeList] = useState([]);

  useEffect(()=>{
    let isCancelled = false;
    const id  = route.params.id;
    async function getAnimeDetails (){
      const animeData = await getAnimeInfo(id)
      setAnimeDetails(animeData);
      setepisodeList(animeData.episodes.reverse())
      setcheckData(false);
    }

    if(!isCancelled){
      getAnimeDetails();
    }

    return ()=>{
      isCancelled = true
    }
  },[])

  useEffect(()=>{
    let isCancelled = false;
    async function getRecentAnimeList(){
      const recentAnimeData = await getData('recentAnimeWatch');
      if(recentAnimeData !== null){
        setrecentAnimeList(recentAnimeData);
      }
    }
    if(!isCancelled){
      getRecentAnimeList();
    }
    return ()=>{
      isCancelled = true
    }
  }, [])

  async function handleEpisode(id){
    try {
        const data = [animeDetails,...recentAnimeList.filter(item => item.id !== animeDetails.id)];
        setrecentAnimeList(data)
        route.params.watchHistory(data)
        await storeData(data, 'recentAnimeWatch')
    } catch (error) {
      console.log(error)
    }

    navigation.navigate("Episodewatch", {
      id,
      animeDetails: animeDetails,
      episodeLists
    })
  }



  return (
    <View style={{flex: 1}}>
    { 
      checkData ? (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={themeStyles.colors.accentColor} />
        </View>
      ) :
      (<View style={styles.mainContent}>
        <View style={styles.firsthalf}>
        <ImageBackground style={styles.bannerImage} source={{uri: animeDetails.image}}>
          <LinearGradient   colors={["#bfafb2","#000"]} style={styles.overlay}></LinearGradient>
          <Pressable onPress={navigation.goBack} style={{position: 'absolute', top: "18%", left: "5%"}}>
              <Ionicons name="arrow-back-outline" size={25} color="#fff" />
          </Pressable>
          <Text style={styles.AnimeTitle}>{animeDetails.title}</Text>
          <Image source={{uri: animeDetails.image}} style={styles.CoverImage} />
        </ImageBackground>
        </View>
       

         
        <View style={{paddingHorizontal: 10, flex: 1}}>
          
            <View style={{flex: 1, height: 200}}>
                <FlatList
                  initialNumToRender={10}
                  style={{flex: 1}}
                  data={episodeLists}
                  renderItem={({item})=>(
                    <TouchableOpacity style={styles.episodeTitle} onPress={()=> handleEpisode(item.id)}>
                        <Text style={{fontSize: 22, fontFamily: "lob-bold", color: "#fff"}}>{item.number}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item)=>item.number}
                  numColumns={4}
                   showsVerticalScrollIndicator={false}
                 ListHeaderComponent={

                  <>
                    <View style={{paddingTop: 20}}>
                      <Text style={{fontFamily: 'pop-bold', color: "#fff",paddingBottom: 5}}>Description</Text>
                      <Text style={styles.description}>{animeDetails.description}</Text>
                      <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Geners</Text>
                      <View style={{fontFamily: 'pop-regular', color: "#fff", flexDirection: "row", flexWrap: 'wrap'}}>{(animeDetails.genres?.map((item)=>(
                        <View key={`${item}1`} style={styles.genersContainer}>
                          <Text key={item} style={styles.geners}>{item}</Text>
                        </View>
                      )))}</View>
                      <View style={{flexDirection: 'row', flexWrap: "wrap", marginTop: 10}}>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Status:</Text>
                        <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.status}</Text>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Release Date:</Text>
                        <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.releaseDate}</Text>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Sub Or Dub:</Text>
                        <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.subOrDub.toUpperCase()}</Text>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Anime type:</Text>
                        <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.type}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", marginVertical: 10}}>
                        <Ionicons  name="list-outline" size={25} color={themeStyles.colors.accentColor} />
                        <Text style={{
                          fontFamily: "pop-bold",color: "#fff", alignItems: "center",paddingHorizontal: 5, fontSize: 18
                        }}>Episode List</Text>
                    </View>
                  </>
                }
                />
            </View>
        </View>
      </View>)
    }
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#000"
  },
  mainContent:{
    flex: 1,
    backgroundColor: "#000"
  },
  firsthalf:{
    height: "26%",
    position: "relative",
  },
  bannerImage:{
    height: "100%"
  },
  overlay:{
    height: "100%",
    width: "100%",
    opacity: .7,
    position: 'absolute',
  }, 
  description:{
    fontFamily: "pop-regular",
    color: '#fff',
    marginBottom: 10

  },
  genersContainer:{
    justifyContent: "center",
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: themeStyles.colors.accentColor,
    marginHorizontal: 5,
    marginBottom: 8,
  },
  geners:{
    color: '#000',
    fontFamily: 'pop-medium',
  },
  AnimeTitle: {
    color: "#fff",
    fontSize: 20,
    position: "absolute",
    bottom: 20,
    marginHorizontal: 10,
    width: "60%",
    fontFamily: "pop-medium"
  },
  episodeTitle:{
    borderWidth: 2,
    borderColor: "#fff",
    padding: 3,
    margin: 5,
    width: "22.5%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  CoverImage:{
    height: 180,
    width: 130,
    elevation: 10,
    position: 'absolute',
    right: "5%",
    bottom: "-10%",
    zIndex: 9,
    borderRadius: 10
  }
})
export default Animedetails