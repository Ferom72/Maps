import React, { useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

interface DisplayPlaceProps {
  selected: google.maps.places.PlaceResult | null;
  info: SavedLocation;
}

interface SavedLocation {
  address: string;
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface LocationData {
  name: string;
  address: string;
  lat: number;
  lng: number;
  token: string;
}

interface location {
  address: string;
  token: string;
}

const DisplayPlace: React.FC<DisplayPlaceProps> = ({ selected, info }) => {
  const [saveLocation, setSaveLocation] = useState(true);

  useEffect(() => {
    async function getStatus() {
      const token = Cookies.get("token");
      const info: location = {
        address: selected?.formatted_address || "",
        token: token || "",
      };

      await axios.post("/api/status", info).then((res) => {
        const response = res.data;

        if (response === true) {
          setSaveLocation(false);
        } else {
          setSaveLocation(true);
        }
      });
    }

    getStatus();
  }, [selected]);

  if (!selected) {
    return (
      <div className="my-">
        <span></span>
      </div>
    );
  }

  async function handleToggle() {
    setSaveLocation(!saveLocation);
  }

  async function handleSaveLocation() {
    await handleToggle();

    if (saveLocation === true) {
      try {
        const lat = selected?.geometry?.location.lat();
        const lng = selected?.geometry?.location.lng();
        const token = Cookies.get("token");

        const locationData: LocationData = {
          name: selected?.name || "",
          address: selected?.formatted_address || "",
          lat: lat || 0,
          lng: lng || 0,
          token: token || "",
        };

        await axios.post("/api/locations", locationData).then((res) => {
          if (res.data === "already saved") {
            toast.error("location already saved");
          } else {
            toast.success("location saved");
          }
        });
      } catch {
        toast.error("couldnt save location");
      }
    } else if (saveLocation === false) {
      const token = Cookies.get("token");
      const deleteLocation: location = {
        address: selected?.formatted_address || "",
        token: token || "",
      };
      await axios.post("/api/removelocations", deleteLocation);
      toast.success("removed saved location");
    }
  }

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 max-w-md mt-3">
      <div>
        {selected.photos && selected.photos.length > 0 && (
          <img
            src={selected.photos[0].getUrl({
              maxWidth: 500,
              maxHeight: 400,
            })}
            alt={selected.name}
            className="w-full rounded-md"
          />
        )}
      </div>
      <div className="flex flex-col mt-3">
        <a
          href={selected.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-semibold mt-2 cursor-pointer"
        >
          {selected.name}
        </a>
        {selected.rating !== undefined ? (
          <div className="flex my-2 items-center">
            <p>rating:</p>
            <p className="text-gray-600 text-sm mx-2">{selected.rating}</p>
          </div>
        ) : (
          <span></span>
        )}
        <div>
          <h5 className="underline underline-offset-2">Address</h5>
          <p className="text-gray-600 mb-2">
            {selected.formatted_address || info.address}
          </p>
        </div>

        {selected.opening_hours !== undefined ? (
          <div className="flex flex-col">
            <h5 className="underline underline-offset-2">Hours of Operation</h5>
            <ul className="mt-2">
              {selected.opening_hours?.weekday_text.map((day, index) => {
                return (
                  <li key={index} className="text-gray-600 text-sm">
                    {day}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <span></span>
        )}

        <div className="flex mt-4">
          <button
            className="flex align-middle text-white p-3 rounded-lg bg-sky-500 hover:bg-sky-700"
            onClick={handleSaveLocation}
          >
            <div>Save Location</div>
            <div>
              {saveLocation ? (
                <FaStar className="mx-2" size={20} />
              ) : (
                <FaStar className="mx-2 text-yellow-400" size={20} />
              )}
            </div>
          </button>
          <button className="text-white p-3 rounded-lg ml-4 bg-sky-500 hover:bg-sky-700">
            Get Destination
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayPlace;
