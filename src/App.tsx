import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "@tanstack/react-location";
import { PokemonProvider, usePokemon } from "./store";

const queryClient = new QueryClient();
const location = new ReactLocation();

const SearchBox = () => {
  const { search, setSearch } = usePokemon();
  return (
    <input
      style={{ margin: "15px auto", width: "80%" }}
      type="search"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

const PokemonList = () => {
  const { pokemon } = usePokemon();
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gap: "10px",
      }}
    >
      {pokemon.map((pokemon) => (
        <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`}>
          <li>{pokemon.ename}</li>
        </Link>
      ))}
    </ul>
  );
};

const PokemonDetails = () => {
  const {
    params: { id },
  } = useMatch();

  const { pokemon } = usePokemon();

  const pokemonData = pokemon.find((p) => p.id === +id);
  if (!pokemonData) {
    return <div>no pokemon data!</div>;
  }
  return <div>{JSON.stringify(pokemonData)}</div>;
};

const routes = [
  {
    path: "/",
    element: (
      <>
        <SearchBox />
        <PokemonList />
      </>
    ),
  },
  {
    path: "/pokemon/:id",
    element: <PokemonDetails />,
  },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonProvider>
        <Router location={location} routes={routes}>
          <div style={{ margin: "0 100px 0 100px" }}>
            <Outlet />
          </div>
        </Router>
      </PokemonProvider>
    </QueryClientProvider>
  );
}

export default App;
