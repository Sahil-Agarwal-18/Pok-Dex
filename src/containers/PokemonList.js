import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { GetPokemonList } from "../actions/pokemonActions";
import { Link } from "react-router-dom";
import ReactPaginate from "react-bootstrap-4-pagination";

const PokemonList = (props) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const pokemonList = useSelector((state) => state.PokemonList);

  useEffect(() => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    if (url.searchParams.get("page")) {
      setPage(Number(url.searchParams.get("page")));
    } else {
      setPage(1);
    }
  }, []);

  useEffect(() => {
    FetchData(page);
  }, [page]);

  const FetchData = (page = 1) => {
    dispatch(GetPokemonList(page));
  };

  const ShowData = () => {
    if (pokemonList.loading) {
      return <p>Loading...</p>;
    }

    if (!_.isEmpty(pokemonList.data)) {
      return (
        <div className={"list-wrapper"}>
          {pokemonList.data.map((el) => {
            return (
              <div className={"pokemon-item"}>
                <p>{el.name}</p>
                <Link to={`/pokemon/${el.name}`}>View</Link>
              </div>
            );
          })}
        </div>
      );
    }

    if (pokemonList.errorMsg !== "") {
      return <p>{pokemonList.errorMsg}</p>;
    }

    return <p>unable to get data</p>;
  };

  return (
    <div>
      <div className={"search-wrapper"}>
        <p>Pokemon name: </p>
        <input type="text" onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => props.history.push(`/pokemon/${search}`)}>
          Search
        </button>
      </div>
      {ShowData()}
      {!_.isEmpty(pokemonList.data) && page > 0 && (
        //<div></div> // This is if I do not want the nav bar at the bottom to show up
        <ReactPaginate
          // pageCount={Math.ceil(pokemonList.count / 15)}
          // pageRangeDisplayed={2}
          // marginPagesDisplayed={1}
          currentPage={page}
          totalPages={5}
          prevNext={true}
          href="http://localhost:3000/?page=*"
          pageOneHref="http://localhost:3000/"
          // onPageChange={(data) => FetchData(data.selected + 1)}
          containerClassName={"pagination"}
        />
      )}
    </div>
  );
};

export default PokemonList;
