import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, Pressable,TouchableOpacity, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { recentEpisode, searchEpisode } from '../utils/data';
import themeStyle from '../config/styles';
import Ionicons from '@expo/vector-icons/Ionicons';

const Search = ({navigation,route}) => {
    const [searchList, setsearchList] = useState([]);
    const [searchText, setsearchText] = useState('');


    useEffect(()=>{
        let isCancelled = false;
        async function fetchRecent(){
            const recentData =  await recentEpisode();
            setsearchList(recentData);
        }

        if(!isCancelled){
            fetchRecent();
        }

        return ()=>{
            isCancelled = true;
        }
    }, [])

    useEffect(()=>{
        let isCancelled = false;
        async function search(){
            const recentData =  await searchEpisode(searchText);
            setsearchList(recentData);
        }

        if(!isCancelled){
            if(searchText != ""){
                search();
            }
        }

        return ()=>{
            isCancelled = true;
        }
    }, [searchText])
    
    function handleAnime(id){
        navigation.navigate("Animedetails", {
            id:id,
            watchHistory: route.params.watchHistory
        });
    }
     
  return (
    <View style={{flex: 1}}>
         <View style={styles.mainContainer}>
                <View style={styles.Header}>
                    <Pressable onPress={navigation.goBack}>
                        <Ionicons name="arrow-back-outline" size={28} style={{padding: 10}} color={themeStyle.colors.accentColor} />
                    </Pressable>
                    <TextInput placeholderTextColor="#fff" onChangeText={setsearchText} style={styles.textInput} value={searchText} autoFocus placeholder="Search..." />
                </View>
                {
                (searchList.length != 0) ?
                    (
                
                        <FlatList
                        data={searchList}    
                        renderItem={({item})=>(
                            <TouchableOpacity style={styles.cardBody} onPress={()=>handleAnime(item.id)}>
                                <Image style={styles.cardImage} source={{uri: item.image}}/>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item)=> item.id}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        />
                    
                    ) : 
                    (
                        <View style={styles.container}>
                            <ActivityIndicator size="large" color={themeStyle.colors.accentColor} />
                        </View>
                    )
                
                }
        </View>
    </View>
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
        backgroundColor: '#000'
    },
    Header:{
        marginTop: 60,
        borderBottomWidth: 1,
        paddingBottom: 18,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        position: "relative",
        alignItems: "center"

    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
    },
    cardBody:{
        marginHorizontal: 10,
        width: '28%',
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
    textInput:{
        color: "#fff",
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: "#494F55",
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 10
    }
})


export default Search