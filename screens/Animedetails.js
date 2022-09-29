import { View, Text, Switch, ImageBackground, ActivityIndicator, Image, StyleSheet, FlatList, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ReadMore from 'react-native-read-more-text';
import { getAnimeInfo } from '../utils/data';
import themeStyles from "../config/styles";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { storeData, getData } from '../utils/storage';

const cleanHTML= (html) => {
  return html.replace(/<[^>]*>?/gm, "");
};

const Animedetails = ({route, navigation}) => {

  const [animeDetails, setAnimeDetails] = useState([]);
  const [checkData, setcheckData] = useState(true);
  const [subordub, setSubOrDub] = useState(true);
  const [episodeLists, setepisodeList] = useState([]);
  const [recentAnimeList, setrecentAnimeList] = useState([]);

  useEffect(()=>{
    let isCancelled = false;
    const id  = route.params.id;
    async function getAnimeDetails (){
      const animeData = await getAnimeInfo(id, subordub)
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
  },[subordub])

  const handleDubOrSub = ()=>{
    setcheckData(true);
    setSubOrDub(!subordub);
  }

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

  const _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: themeStyles.colors.accentColor, marginTop: 5, marginBottom: 10}} onPress={handlePress}>
        Read more
      </Text>
    );
  }
 
  const _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color:themeStyles.colors.accentColor, marginTop: 5, marginBottom: 10}} onPress={handlePress}>
        Show less
      </Text>
    );
  }
 
  const _handleTextReady = () => {
    // ...
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
        <ImageBackground style={styles.bannerImage} source={{uri: animeDetails?.cover != "" ? animeDetails.cover : animeDetails.image }}>
          <LinearGradient   colors={["#bfafb2","#000"]} style={styles.overlay}></LinearGradient>
          <Pressable onPress={navigation.goBack} style={{position: 'absolute', top: "18%", left: "5%"}}>
              <Ionicons name="arrow-back-outline" size={25} color="#fff" />
          </Pressable>
          <Text style={styles.AnimeTitle}>{animeDetails.title.english}</Text>
          <Image source={{uri: animeDetails.image}} style={styles.CoverImage} />
        </ImageBackground>
        </View>
       

         
        <View style={{paddingHorizontal: 10, flex: 1}}>
          
            <View style={{flex: 1, height: 200}}>
                <FlatList
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
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
                      <ReadMore
                        numberOfLines={5}
                        renderTruncatedFooter={_renderTruncatedFooter}
                        renderRevealedFooter={_renderRevealedFooter}
                        onReady={_handleTextReady}>
                        <Text style={styles.description}>{cleanHTML(animeDetails.description)}</Text>
                      </ReadMore>
                      <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Characters</Text>
                      
                      <FlatList
                        style={{flex: 1}}
                        data={animeDetails.characters}
                        keyExtractor={(item)=> item.id}
                        renderItem={(item)=> (
                          <TouchableOpacity style={[styles.watchcardBody]}>
                            <Image style={styles.cardImage} source={{uri: item.item.image}}/>
                            <Text style={[styles.cardTitle, {marginTop: 5}]}> {item.item.name.userPreferred}</Text>
                            <Text style={[styles.cardTitle, {fontSize: 12}]}>({item.item.role})</Text>
                          </TouchableOpacity>
                        )} 
                        horizontal={true}                     
                      
                      />


                     
                      <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Geners</Text>
                      <View style={{fontFamily: 'pop-regular', color: "#fff", flexDirection: "row", flexWrap: 'wrap'}}>{(animeDetails.genres?.map((item)=>(
                        <View key={`${item}1`} style={styles.genersContainer}>
                          <Text key={item} style={styles.geners}>{item}</Text>
                        </View>
                      )))}</View>
                      <View style={{flexDirection: 'row', flexWrap: "wrap", justifyContent: 'center',alignItems: 'center'}}>
                        <View style={{flexDirection: "row",  alignItems: "center"}}>
                          <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>Sub</Text>
                          <Switch
                            trackColor={{ false: "#808080", true: "#808080" }}
                            thumbColor={subordub ? themeStyles.colors.accentColor : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleDubOrSub}
                            value={subordub}
                          />
                            <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>Dub</Text>
                        </View>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff"}}>Status:</Text>
                        <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.status}</Text>
                       
                        <Text style={{fontFamily: 'pop-bold', color: "#fff"}}>Rating:</Text>
                        <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.rating}</Text>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff"}}>Release Date:</Text>
                        <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.releaseDate}</Text>
                        
                        <Text style={{fontFamily: 'pop-bold', color: "#fff"}}>Anime type:</Text>
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
  watchcardBody:{
    marginHorizontal: 8,
    elevation: 4,
    width: 120
  },
  cardImage:{
    width: "100%",
    height: 120,
    minWidth: 120,
    borderRadius: 10,
  },
  cardTitle:{
    textAlign: 'center',
    fontSize: 14,
    fontFamily: "pop-medium",
    color: "#fff",
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