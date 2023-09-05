"use client";

import { useEffect, useState } from "react";
import Nav from "../components/nav/Nav";
import axios from "axios";
import Cookies from "js-cookie";
import { FaArrowRightLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface deletelocation {
  address: string;
  token: string;
}

const SavedLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteSavedLocation, setDeleteSavedLocation] = useState(false);
  const locationsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    axios.post("/api/getlocations", { token }).then((res) => {
      const locations = res.data;

      setLocations(locations);
    });
  }, [deleteSavedLocation]);

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = locations.slice(
    indexOfFirstLocation,
    indexOfLastLocation
  );

  async function handleDelete(savedAddress: string) {
    setDeleteSavedLocation(true);

    try {
      const token = Cookies.get("token");
      const deleteLocation: deletelocation = {
        address: savedAddress || "",
        token: token || "",
      };

      await axios.post("/api/removelocations", deleteLocation).then(() => {
        toast.success("removed saved location");
      });

      setDeleteSavedLocation(false);
    } catch {}
  }

  function handleClick(value: string) {
    router.push("/landing");
  }

  const Location = () => {
    return currentLocations.map((location) => {
      return (
        <div key={location.id} className="flex justify-center m-5 ">
          <div className="border rounded-lg shadow-md p-4 max-w-md">
            <div>
              <h1 className="text-xl font-semibold">{location.name}</h1>
            </div>
            <div className="text-gray-600 mb-2">
              <span>{location.address}</span>
            </div>
            <div className="flex mt-4">
              <button
                className="text-white p-3 rounded-lg bg-sky-500 hover:bg-sky-700"
                onClick={() => handleDelete(location.address)}
              >
                Delete Location
              </button>
              <button
                className="flex items-center text-white p-3 rounded-lg ml-4 bg-sky-500 hover:bg-sky-700"
                onClick={() => handleClick(location.address)}
              >
                <div className="mr-2">Display Destination</div>
                <div>
                  <FaArrowRightLong />
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Nav />
      <h1 className="text-2xl font-semibold text-center mb-2">
        Saved Locations
      </h1>
      <div className="flex flex-col justify-center">
        <Location />
        <div className="flex justify-center mt-4">
          <span className="mx-2 py-1">Pages</span>
          {Array.from({
            length: Math.ceil(locations.length / locationsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-2 py-1 px-3 rounded ${
                currentPage === index + 1
                  ? "bg-sky-500 text-white"
                  : "bg-gray-300"
              } hover:bg-sky-700 hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedLocations;
