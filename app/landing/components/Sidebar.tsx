import React, { useEffect, useState, useCallback, useMemo } from "react";
import Searchbar from "./components/Searchbar";

interface SidebarProps {
  setlocation: (value: { lat: number; lng: number } | undefined) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setlocation }) => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-center mt-2">
          <div className="use-client">
            <Searchbar setlocation={setlocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
