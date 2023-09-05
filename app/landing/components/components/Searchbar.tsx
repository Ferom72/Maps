import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaDirections, FaSistrix } from "react-icons/fa";
import Head from "next/head";
import DisplayPlace from "./components/Displayplace";

interface SearchbarProps {
  setlocation: (value: { lat: number; lng: number } | undefined) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ setlocation }) => {
  const [searchbar, setSearchBar] = useState<string | null>("");

  const [googleLoaded, setGoogleLoaded] = useState(false);

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places`;
    script.async = true;
    script.onload = () => {
      setGoogleLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (googleLoaded && searchbar && !autocomplete) {
      const input = document.getElementById("search-input") as HTMLInputElement;
      if (input) {
        const newAutocomplete = new google.maps.places.Autocomplete(input);
        newAutocomplete.addListener("place_changed", () => {
          const place = newAutocomplete.getPlace();
          setlocation({
            lat: place.geometry?.location.lat() as number,
            lng: place.geometry?.location.lng() as number,
          });
          setSearchBar(truncate(place.formatted_address as string, 35));
          setSelectedPlace(place);
        });
        setAutocomplete(newAutocomplete);
      }
    }
  }, [googleLoaded, searchbar, autocomplete]);

  function truncate(str: string, n: number): string {
    return str?.length > n ? str.substring(0, n - 1) + "..." : str;
  }

  const googleMapsApiScriptUrl = useMemo(
    () =>
      `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places&callback=initMap`,
    []
  );

  return (
    <div>
      <Head>
        <script async src={googleMapsApiScriptUrl}></script>
      </Head>
      <div className="flex justify-center">
        <div
          className="flex 
                    justify-between
                    py-2 
                    px-3
                    bg-white 
                    border 
                    rounded-full 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    w-80"
        >
          <div>
            <input
              id="search-input"
              value={searchbar as string}
              className="pr-7 w-full"
              type="text"
              placeholder="Search for a location"
              onChange={(e) => setSearchBar(e.target.value)}
            />
          </div>
          <div className="flex">
            <FaSistrix
              className="text-gray-500 cursor-pointer mx-2"
              size={22}
            />
            <FaDirections
              className="text-blue-500 cursor-pointer mx-2"
              size={22}
            />
          </div>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-2">
            <ul>
              {suggestions.map((prediction) => (
                <li key={prediction.id}>{prediction.description}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedPlace !== null ? (
        <div>
          <DisplayPlace selected={selectedPlace} />
        </div>
      ) : (
        <div className="text-center my-80">
          <div>
            <span>Location will be displayed here</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
