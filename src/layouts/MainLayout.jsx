import React from "react";

// Router
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="pt-5">
        <div className="flex items-center justify-center gap-5 container">
          <Link to="/">Add</Link>
          <Link to="/delete">Delete</Link>
        </div>
      </header>

      {/* main */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
