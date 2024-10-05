import React from "react";

// Router
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import Add from "./pages/Add";
import Delete from "./pages/Delete";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Add />} />
        <Route path="delete" element={<Delete />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
