import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getAnimeVideoLink } from '../utils/data';
import {Dimensions} from 'react-native';


const Episodewatch = ({route}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [Referer, setReferer] = useState('');
  const [videoStatus, setvideoStatus] = useState(true);

  function setOrientation() {
    if (Dimensions.get('window').height > Dimensions.get('window').width) {

      //Device is in portrait mode, rotate to landscape mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    }
    else {
      
      //Device is in landscape mode, rotate to portrait mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    }
  }

  useEffect(()=>{
    async function getVideoUrl(){
      const videoId = route.params.id
      const VideoData = await getAnimeVideoLink(videoId);

      setVideoUrl(VideoData.sources[1].url);
      setReferer(VideoData.headers.Referer)
      console.log(VideoData.headers)
      setvideoStatus(false)

    }

    getVideoUrl();
  }, [])

  return (
    <View style={{flex: 1}}>
     { videoStatus ? <ActivityIndicator size="large" /> : (<Video
      source={{ uri: videoUrl, headers: {"Referer": Referer,"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0"} }}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="contain"
      shouldPlay
      onFullscreenUpdate={setOrientation}
      isLooping
      style={{ width: "100%", height: 250 }}
      useNativeControls
      onError={(e)=>{
        console.log(e)
      }}
      />) }
    </View>
  )
}

export default Episodewatch