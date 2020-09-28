import React, { Component, useEffect, useState } from "react";
import Header from "../Header/Header";
import Next from "../Next/Next";
import History from "../History/History";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { Game, getPrevChampion, buildBeltPath } from "../../helpers/gameHistory";
import "./App.css";

const bbApi = `https://www.balldontlie.io/api/v1/games?seasons[]=`;

export type PageResponse = {
    data: Game[];
    meta: {
        next_page: number
    }
}

const getPreviousChamp = async (season: number) => {
    const storedChamp = sessionStorage.getItem('previousSeasonChamp');
    const parsedChamp = storedChamp ? JSON.parse(sessionStorage.getItem('previousSeasonChamp') || '') : null;
    if (parsedChamp) {
        return parsedChamp;
    }
    const previousPostSeasonGames: Game[] = await (await axios.get(`${bbApi}${season - 1}&postseason=true&per_page=100`)).data.data;
    const previousChampGame = previousPostSeasonGames[previousPostSeasonGames.length - 1]
    const previousChamp = getPrevChampion(previousChampGame)
    sessionStorage.setItem('previousSeasonChamp', JSON.stringify(previousChamp));
    return previousChamp;
}

const gamesList: Game[] = [];

const getAllGames = async (season: number, page: number = 1): Promise<Game[] | undefined> => {
    if (sessionStorage.getItem('gameData')) {
        return JSON.parse(sessionStorage.getItem('gameData') || '');
    }
    try {
        const pageData: AxiosResponse<PageResponse> = await axios.get(`${bbApi}${season}&per_page=100&page=${page}`);
        const newGames = pageData?.data?.data;
        // @ts-ignore
        gamesList.push([...newGames])
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
        return sortedGames;
    } catch (e) {
        console.error('Whoops!', e)
        return;
    }
}

const App = () => {
    const season = 2019;

    useEffect(() => {
        const fetchData = async () => {
            const previousChamp = await getPreviousChamp(season);
            const allGames: Game[] | undefined = await getAllGames(season);
            if (!allGames) {
                console.log('stop!')
                return;
            }
        }
        fetchData()
    }, []);

    return (
        <div className="App">
            {/* <Header theBelt={this.state.currentChamp} /> */}
            {/* {this.state.beltPath.reverse().map((game) => (
            <div>
                <History
                gameDate={moment(game.date)
                    .add(1, "days")
                    .format("LL")}
                game={game}
                />
            </div>
            ))} */}
        </div>
    )
}

export default App;