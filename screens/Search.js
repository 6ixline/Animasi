import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { recentEpisode, searchEpisode } from '../utils/data';

const Search = ({navigation}) => {
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
            id:id
        });
    }
     
  return (
    <View style={{flex: 1}}>
         <View style={styles.mainContainer}>
                <View style={styles.Header}>
                    <TextInput onChangeText={setsearchText} value={searchText} autoFocus placeholder="Enter Anime name..." />
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
                        <KeyboardAvoidingView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <Text>Find you faviroute</Text>
                        </KeyboardAvoidingView>
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
    }
})


export default Search