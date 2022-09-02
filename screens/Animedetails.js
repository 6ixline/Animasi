import { View, Text, ImageBackground, ActivityIndicator, Image,StyleSheet, FlatList,Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAnimeInfo } from '../utils/data';
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';


const Animedetails = ({route, navigation}) => {

  const [animeDetails, setAnimeDetails] = useState([]);
  const [checkData, setcheckData] = useState(true);
  const [episodeLists, setepisodeList] = useState([]);

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

  function handleEpisode(id){
    navigation.navigate("Episodewatch", {
      id
    })
  }

  return (
    <View style={{flex: 1}}>
    { 
      checkData ? (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="auto" />
        </View>
      ) :
      (<View style={styles.mainContent}>
        <View style={styles.firsthalf}>
        <ImageBackground style={styles.bannerImage} source={{uri: animeDetails.image}}>
          <LinearGradient   colors={["#bfafb2","#000"]} style={styles.overlay}></LinearGradient>
          <Pressable onPress={navigation.goBack} style={{position: 'absolute', top: "18%", left: "5%"}}>
              <Ionicons name="arrow-back-outline" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.AnimeTitle}>{animeDetails.title}</Text>
          <Image  source={{uri: animeDetails.image}} style={styles.CoverImage} />
        </ImageBackground>
        </View>
       

         
        <View style={{paddingHorizontal: 10, flex: 1}}>
          
            <View style={{flex: 1, height: 200}}>
                <FlatList
                
                  style={{flex: 1}}
                  data={episodeLists}
                  renderItem={({item})=>(
                    <TouchableOpacity style={styles.episodeTitle} onPress={()=> handleEpisode(item.id)}>
                        <Text style={{fontSize: 20}}>{item.number}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item)=>item.number}
                  numColumns={4}
                   showsVerticalScrollIndicator={false}
                 ListHeaderComponent={

                  <>
                    <View style={{paddingTop: 20}}>
                      <Text style={{fontWeight: 'bold', paddingBottom: 5}}>Description</Text>
                      <Text style>{animeDetails.description}</Text>
                      <Text style={{fontWeight: 'bold', paddingVertical:10 }}>Geners</Text>
                      <Text>{(animeDetails.genres?.join(", "))}</Text>
                    </View>
                  <Text style={{fontWeight: 'bold', paddingVertical: 15}}>Episode List</Text>
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
    alignItems: "center"

  },
  mainContent:{
    flex: 1,
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
  AnimeTitle: {
    color: "#fff",
    fontSize: 20,
    position: "absolute",
    bottom: 20,
    marginHorizontal: 10,
    width: "60%"
  },
  episodeTitle:{
    borderWidth: 2,
    borderColor: "#000",
    padding: 3,
    margin: 10,
    width: 80,
    height: 40,
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