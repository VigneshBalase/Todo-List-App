import React from "react";
import ProfileHover from "../Components/Cards"; 
import NavBar from "../Components/NavBar";

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      {/* Your Existing NavBar */}
      <div style={{ width: '250px', }}>
        <NavBar />
      </div>

      {/* Main Content - Cards on the right */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>

        <ProfileHover />
      </div>
      
    </div>
  );
}

export default App;
