import React, { useEffect } from "react";
import { PageTitle } from "../components/PageTitle";
import PokeList from "../components/PokeList";
import { SearchBox } from "../components/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNameAndId,
  getPokemons,
} from "../features/pokemons/pokemonSlice";

export const HomePage = () => {
  const { search, page, type } = useSelector((state) => state.pokemons);

  const dispatch = useDispatch();
  useEffect(() => {
 
    dispatch(getPokemons({ page, search, type }));
  }, [page, search, type, dispatch]);
  useEffect(() => {
    dispatch(getAllNameAndId());
  }, [dispatch]);
  return (
    <>
      <PageTitle title="Pokedex" />
      <SearchBox />
      <PokeList />
    </>
  );
};
