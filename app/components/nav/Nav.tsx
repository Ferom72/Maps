"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Nav = () => {
  const router = useRouter();

  function handleLogout() {
    Cookies.remove("token");
    router.push("/");
  }

  function handleRedirect() {
    router.push("/savedlocations");
  }

  function handleLandingPage() {
    router.push("/landing");
  }

  return (
    <div className="flex justify-between p-2 items-center bg-gray-600 text-white">
      <div className="mx-4">
        <h2 className="text-2xl cursor-pointer" onClick={handleLandingPage}>
          Maps
        </h2>
      </div>
      <div className="flex mx-4">
        <span className="mx-2 cursor-pointer" onClick={handleRedirect}>
          Saved Locations
        </span>
        <span className="mx-2 cursor-pointer" onClick={handleLogout}>
          Logout
        </span>
      </div>
    </div>
  );
};

export default Nav;
