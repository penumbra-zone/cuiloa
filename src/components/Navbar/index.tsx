import { type FC } from "react";
import SearchBar from "../Searchbar";



const Navbar : FC = () => {
  return (
  <div className="flex flex-col items-center justify-center pt-5">
    <h1 className="font-bold text-xl md:text-2xl">Penumbra Block Explorer</h1>
    <p>Explore transactions and blocks on the Penumbra Network</p>
    <SearchBar />
  </div>
  );
};

export default Navbar;