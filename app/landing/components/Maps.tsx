import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface MapsProps {
  location: { lat: number; lng: number } | undefined;
}

interface SavedLocation {
  address: string;
  id: string;
  lat: number;
  lng: number;
  name: string;
}

const Map: React.FC<MapsProps> = ({ location }) => {
  const [savedlocation, setSavedLocation] = useState<SavedLocation | null>();

  useEffect(() => {
    async function GetLocation() {
      const token = Cookies.get("token") as string;

      if (Cookies.get("savedlocation")) {
        const locationtoken = Cookies.get("savedlocation") as string;

        if (locationtoken === undefined) {
          return setSavedLocation(null);
        }

        const data = {
          token,
          locationtoken,
        };

        await axios.post("/api/getSavedLocation", { data }).then((res) => {
          setSavedLocation(res.data);
        });

        Cookies.remove("savedlocation");
      }
    }

    GetLocation();
  }, []);

  if (savedlocation) {
    return (
      <iframe
        className="w-full h-screen"
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=${savedlocation.lat},${savedlocation.lng}`}
      ></iframe>
    );
  } else {
    if (location) {
      return (
        <iframe
          className="w-full h-screen"
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=${location.lat},${location.lng}`}
        ></iframe>
      );
    } else {
      return (
        <iframe
          className="w-full h-full"
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=Space+Needle,Seattle+WA`}
        ></iframe>
      );
    }
  }
};

export default Map;
