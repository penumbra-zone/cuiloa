import { type FC } from "react";



const Navbar : FC = () => {
  return (
  <div className="flex flex-col items-center justify-center pt-5">
    <h1 className="font-bold text-xl md:text-2xl">Penumbra Block Explorer</h1>
    <p>Explore transactions and blocks on the Penumbra Network</p>
  </div>
  );
};

export default Navbar;