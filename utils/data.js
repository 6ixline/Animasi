import axios from "axios";

export async function topAiring(){
    try {
        const data = await axios.get("https://consumet-api.herokuapp.com/anime/gogoanime/top-airing");
        return data.data.results;
    } catch (error) {
        return [];
    }
}
export async function recentEpisode(){
    try {
        const data = await axios.get("https://consumet-api.herokuapp.com/anime/gogoanime/recent-episodes");
        return data.data.results;
    } catch (error) {
        return [];
    }
}
export async function searchEpisode(query){
    try {
        const data = await axios.get(`https://consumet-api.herokuapp.com/anime/gogoanime/${query}`);
        return data.data.results;
    } catch (error) {
        return [];
    }
}
export async function getAnimeInfo(id){
    try {
        const data = await axios.get(`https://consumet-api.herokuapp.com/anime/gogoanime/info/${id}`);
        return data.data;
    } catch (error) {
        return [];
    }
}

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";
export async function getAnimeVideoLink(id){
    try {
        const data = await axios.get(`https://gogoanime.herokuapp.com/vidcdn/watch/${id}`, {
            headers: {
                'User-Agent': USER_AGENT,
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        return data.data;
    } catch (error) {
        return [];
    }
}