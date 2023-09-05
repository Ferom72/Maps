interface MapsProps {
  location: { lat: number; lng: number } | undefined;
}

const Map: React.FC<MapsProps> = ({ location }) => {
  if (location === undefined) {
    return (
      <iframe
        className="w-full h-full"
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=Space+Needle,Seattle+WA`}
      ></iframe>
    );
  } else {
    return (
      <iframe
        className="w-full h-screen"
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=${location.lat},${location.lng}`}
      ></iframe>
    );
  }
};

export default Map;
