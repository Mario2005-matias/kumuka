import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";

export function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Navbar />
      <div className="page-enter flex-1" key={pathname}>
        <Outlet />
      </div>
    </div>
  );
}
