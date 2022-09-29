import axios from "axios";

const apiUrl = "https://api.consumet.org/";

export async function getpopularAnime(){
    try {
        const data = await axios.get(`${apiUrl}meta/anilist/popular`);
        return data.data.results;
    } catch (error) {
        return [];
    }
}
export async function getTrendingAnime(){
    try {
        const data = await axios.get(`${apiUrl}meta/anilist/trending?perPage=18`);
        return data.data.results;
    } catch (error) {
        return [];
    }
}
export async function recentEpisode(){
    try {
        const data = await axios.get(`${apiUrl}meta/anilist/recent-episodes`);
        return data.data.results;
    } catch (error) {
        return [];
    }
}

export async function searchEpisode(query){
    try {
        const data = await axios.get(`${apiUrl}meta/anilist/advanced-search?query=${query}&perPage=16`);
        return data.data.results;
    } catch (error) {
        return [];
    }
}
export async function getAnimeInfo(id, dub = false){
    try {
        const data = await axios.get(`${apiUrl}meta/anilist/info/${id}?provider=gogoanime&dub=${dub}`);
        return data.data;
    } catch (error) {
        return [];
    }
}

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";
export async function getAnimeVideoLink(id){
    try {
        const data = await axios.get(`${apiUrl}meta/anilist/watch/${id}`, {
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