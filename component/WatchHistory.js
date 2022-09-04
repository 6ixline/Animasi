import { StyleSheet, FlatList } from 'react-native'
import React from 'react'
import Title from './Title'
import Card from './Card'

const WatchHistory = ({data, animeHandle}) => {
  return (
        <>
            <Title boldTitle="Recent" NormalTitle="Watch History" icon="apps-outline" />
            <FlatList
            data={data}    
            renderItem={({item})=>(
               <Card item={item} animeHandle={animeHandle} />
            )}
            keyExtractor={(item)=> item.id}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            /> 
        </>
  )
}

const styles = StyleSheet.create({
   
})

export default WatchHistory