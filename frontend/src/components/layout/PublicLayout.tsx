import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
