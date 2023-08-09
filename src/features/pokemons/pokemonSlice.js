import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POKEMONS_PER_PAGE } from "../../app/config";

const initialState = {
  isLoading: false,
  allName: [],
  allId: [],
  pokemons: [],
  pokemon: {
    pokemon: null,
    nextPokemon: null,
    previousPokemon: null,
  },
  search: "",
  type: "",
  page: 1,
  error: null,
};

const pokemonSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    changePage(state, action) {
      if (action.payload) {
        if (action.payload === 1) {
          state.pokemons = [];
          state.page = action.payload;
        }
      } else {
        state.page++;
      }
    },
    typeQuery(state, action) {
      state.type = action.payload;
      state.search = "";
    },
    searchQuery(state, action) {
      state.search = action.payload;
    },
    resetState(state) {
      state.search = "";
      state.type = "";
      state.pokemons = [];
      state.page = 1;
    },
    getPokemonsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("payload getPokemons", action.payload);
      const { search, type } = state;
      console.log({ search, type });
      if ((search || type) && state.page === 1) {
        state.pokemons = action.payload;
      } else {
        state.pokemons = [...state.pokemons, ...action.payload];
      }
      // state.pokemons = action.payload;
    },
    getPokemonsByIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("payload getPokemonsById", action.payload);
      state.pokemon = action.payload;
      console.log("pokemon", state.pokemon);
    },
    getAllNameAndIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("payload allId", action.payload);
      state.allId = action.payload.allId;
      state.allName = action.payload.allName;
    },
    addPokemonSuccess(state, action) {
      state.error = null;
      const { newPokemon } = action.payload;
      state.pokemons.push(newPokemon);
      state.allId.push(newPokemon.id);
      state.allName.push(newPokemon.name);
      state.isLoading = false;
      console.log("payload addPokemon", action.payload);
    },
    deletePokemonSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("payload  deletePokemon", action.payload);
    },
    editPokemonSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      console.log("payload  editPokemon", action.payload);
    },
  },
});

export const getPokemons =
  ({ page, search, type }) =>
  async (dispatch) => {
    dispatch(pokemonSlice.actions.startLoading());
    try {
      let url = `/pokemons?page=${page}&limit=${POKEMONS_PER_PAGE}`;
      console.log("url", url);
      if (search) url += `&name=${search}`;
      if (type) url += `&type=${type}`;
      const response = await apiService.get(url);
      console.log("respone check", response);
      dispatch(pokemonSlice.actions.getPokemonsSuccess(response));
    } catch (error) {
      dispatch(pokemonSlice.actions.hasError(error));
      // toast.error(error.message);
    }
  };
export const getPokemonById = (id) => async (dispatch) => {
  dispatch(pokemonSlice.actions.startLoading());
  try {
    let url = `/pokemons/${id}`;
    console.log("url", url);
    const response = await apiService.get(url);
    dispatch(pokemonSlice.actions.getPokemonsByIdSuccess(response));
  } catch (error) {
    dispatch(pokemonSlice.actions.hasError(error));
    // toast.error(error.message);
  }
};
export const getAllNameAndId = () => async (dispatch) => {
  dispatch(pokemonSlice.actions.startLoading());
  try {
    let url = `/pokemons/allid/all`;
    const response = await apiService.get(url);
    dispatch(pokemonSlice.actions.getAllNameAndIdSuccess(response));
  } catch (error) {
    dispatch(pokemonSlice.actions.hasError(error));
    // toast.error(error.message);
  }
};
export const addPokemon = (formData, id) => async (dispatch) => {
  dispatch(pokemonSlice.actions.startLoading());
  try {
    let url = "/pokemons";
    const response = await apiService.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(pokemonSlice.actions.addPokemonSuccess(response));
    dispatch(getPokemonById(id));
  } catch (error) {
    dispatch(pokemonSlice.actions.hasError(error));
    // toast.error(error.message);
  }
};

export const deletePokemon =
  ({ id }) =>
  async (dispatch) => {
    dispatch(pokemonSlice.actions.startLoading());
    try {
      let url = `/pokemons/${id}`;
      const response = await apiService.delete(url);
      dispatch(pokemonSlice.actions.addPokemonSuccess(response.data));
    } catch (error) {
      dispatch(pokemonSlice.actions.hasError(error));
      // toast.error(error.message);
    }
  };
const { actions, reducer } = pokemonSlice;
export const { changePage, searchQuery, typeQuery,resetState } = actions;
export default reducer;
