import { createSlice } from "@reduxjs/toolkit";
import SearchResults from "../../../pages/search/tabs/results/results";


interface searchState{
    searchResults:{
        users:string[],
        products:string[]
    };
    searchHistory:string[]
}

const initialState:searchState = {
    searchResults:{
        users:[],
        products:[]
    },
    searchHistory:[]
}


const search = createSlice({
    name:"search",
    initialState,
    reducers:{
        updateSearchResult:(state, {payload}) => {
            state.searchResults = payload;
        },
        addSearchHistory:(state, {payload}) => {
            let prevSearchHistory:any = state.searchHistory;
            let newHistory:string = payload;
            if(prevSearchHistory.includes(newHistory)){
                prevSearchHistory = prevSearchHistory.filter((item:string) => item !== newHistory);
            }
            state.searchHistory = [payload, ...prevSearchHistory];
        },
        deleteHistory:(state, {payload}) => {
            let currentSearchHistory = state.searchHistory;
            let deletedItem = payload;
            if(currentSearchHistory.includes(deletedItem)){
                currentSearchHistory = currentSearchHistory.filter((item:string) => item !== deletedItem );
            }
            state.searchHistory = [...currentSearchHistory];
        }
    }
});

export const {updateSearchResult, addSearchHistory} = search.actions;
export default search.reducer;