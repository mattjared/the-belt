import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import History from "../History/History";
import axios, { AxiosResponse } from "axios";
import { Game, getPrevChampion, buildBeltPath, moreThanAnHourAgo } from "../../helpers/gameHistory";
import "./App.css";

const bbApi = `https://www.balldontlie.io/api/v1/games?seasons[]=`;

export type PageResponse = {
    data: Game[];
    meta: {
        next_page: number
    }
}

interface AllGames {
    games: Game[]
}

const getPreviousChamp = async (season: number) => {
    const storedChamp = sessionStorage.getItem('previousSeasonChamp');
    const parsedChamp = storedChamp ? JSON.parse(sessionStorage.getItem('previousSeasonChamp') || '') : null;
    if (parsedChamp && !moreThanAnHourAgo(parsedChamp.updated)) {
        return parsedChamp;
    }
    const previousPostSeasonGames: Game[] = await (await axios.get(`${bbApi}${season - 1}&postseason=true&per_page=100`)).data.data;
    const previousChampGame = previousPostSeasonGames[previousPostSeasonGames.length - 1]
    const previousChamp = getPrevChampion(previousChampGame)
    sessionStorage.setItem('previousSeasonChamp', JSON.stringify({...previousChamp, updated: new Date(),}));
    return previousChamp;
}

const gamesList: Game[] = [];

const getAllGames = async (season: number, page: number = 1): Promise<AllGames | undefined> => {
    const storedGameData = sessionStorage.getItem('gameData');
    if (storedGameData && !moreThanAnHourAgo(JSON.parse(storedGameData || '').updated)) {
        return JSON.parse(storedGameData || '');
    }
    try {
        const pageData: AxiosResponse<PageResponse> = await axios.get(`${bbApi}${season}&per_page=100&page=${page}`);
        const newGames = pageData?.data?.data;
        // @ts-ignore
        gamesList.push(...newGames)
        if (pageData.data.meta.next_page) {	
            const nextPageData = await getAllGames(season, pageData.data.meta.next_page)	
        }
        const sortedGames = gamesList.sort(
            (a, b) =>
              Number(new Date(a.date)) -
              Number(new Date(b.date))
          );
        const gameData = {
            games: sortedGames,
            updated: new Date(),
        }
        sessionStorage.setItem('gameData', JSON.stringify(gameData));
        return gameData;
    } catch (e) {
        console.error('Whoops!', e)
        return;
    }
}

const App = () => {
    // TODO: make this dynamic somehow so we can go back and look at previous seasons
    const season = 2019;
    const [beltPath, setBeltPath] = useState<Game[]>([]);
    const [champName, setChamp] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const previousChamp = await getPreviousChamp(season);
            const allGames: AllGames | undefined = await getAllGames(season);
            if (!allGames) {
                return;
            }
            const path = buildBeltPath(previousChamp, allGames.games);
            setChamp((path[path.length - 1] || {}).abbreviation);
            setBeltPath(path);
        }
        fetchData()
    }, []);

    return (
        <div className="App">
            <Header loading={!beltPath.length} theBelt={champName} />
            {beltPath.reverse().map((game) => (
            <div className="History-container" key={`${game.gameIndex}`}>
                <History
                gameDate={game.date}
                game={game}
                />
            </div>
            ))}
        </div>
    )
}

export default App;
