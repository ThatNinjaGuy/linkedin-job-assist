import React, { useState } from "react";
import Generator from "./components/Generator";
import Profile from "./components/Profile";
import { ROUTES } from "./utils/routes";

function App() {
  const [page, setPage] = useState(ROUTES.GENERATOR);

  return (
    <>
      {page === ROUTES.GENERATOR && (
        <Generator onSettingsClick={() => setPage(ROUTES.PROFILE)} />
      )}
      {page === ROUTES.PROFILE && (
        <Profile onBackClick={() => setPage(ROUTES.GENERATOR)} />
      )}
    </>
  );
}

export default App;
