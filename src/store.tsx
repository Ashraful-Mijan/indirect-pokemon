import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";

interface Pokemon {
  accuracy: number;
  category: string;
  cname: string;
  ename: string;
  id: number;
  jname: string;
  power: number;
  pp: number;
  type: string;
}

function usePokemonSource(): {
  pokemon: Pokemon[];
  search: string;
  setSearch: (search: string) => void;
} {
  const { data: pokemon } = useQuery<Pokemon[]>(
    ["pokemon"],
    () => fetch("/pokemon.json").then((res) => res.json()),
    {
      initialData: [],
    }
  );

  type PokemonState = {
    search: string;
  };

  type PokemonAction = { type: "setSearch"; payload: string };

  const [{ search }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonAction) => {
      switch (action.type) {
        case "setSearch":
          return { ...state, search: action.payload };
        default:
          return state;
      }
    },
    {
      search: "",
    }
  );

  const setSearch = useCallback((search: string) => {
    dispatch({
      type: "setSearch",
      payload: search,
    });
  }, []);

  const filteredPokemon = useMemo(
    () =>
      pokemon
        .filter((p) => p.ename.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 50),
    [pokemon, search]
  );

  const sortedPokemon = useMemo(
    () => [...filteredPokemon].sort((a, b) => a.ename.localeCompare(b.ename)),
    [filteredPokemon]
  );

  return { pokemon: sortedPokemon, search, setSearch };
}

const PokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
  {} as unknown as ReturnType<typeof usePokemonSource>
);

export const usePokemon = () => {
  return useContext(PokemonContext);
};

export function PokemonProvider({ children }: { children: ReactNode }) {
  return (
    <PokemonContext.Provider value={usePokemonSource()}>
      {children}
    </PokemonContext.Provider>
  );
}
