"use client";

import { useState } from "react";
import Nav from "../components/nav/Nav";
import Map from "./components/Maps";
import Sidebar from "./components/Sidebar";

interface DisplayPlaceProps {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const Home = () => {
  const [location, setLocation] = useState<
    { lat: number; lng: number } | undefined
  >();

  function SetLocation(value: { lat: number; lng: number } | undefined) {
    setLocation(value);
  }

  const [pickedLocation, setPickedLocation] =
    useState<DisplayPlaceProps | null>(null);

  return (
    <div>
      <Nav />
      <div className="grid grid-cols-3 bg-gray-200 h-[48rem]">
        <div className="flex justify-center">
          <Sidebar setlocation={SetLocation} />
        </div>
        <div className="col-span-2">
          <Map location={location} />
        </div>
      </div>
    </div>
  );
};

export default Home;
