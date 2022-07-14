import "./App.css";

import React, { useState, useEffect } from "react";

import GeoJSON from "ol/format/GeoJSON";

import MapWrapper from "./components/MapWrapper";
import MarkerImage from "./assets/marker.png";
import "./map.css";

function App() {
  const [features, setFeatures] = useState([]);

  const [exibir, setExibir] = useState(false);

  useEffect(() => {
    fetch("/mock-geojson-api.json")
      .then((response) => response.json())
      .then((fetchedFeatures) => {
        const wktOptions = {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        };
        const parsedFeatures = new GeoJSON().readFeatures(
          fetchedFeatures,
          wktOptions
        );

        setFeatures(parsedFeatures);
      });
  }, []);

  const callback = (hdms) => {
    console.log(hdms, "fff");
    setExibir(true);
  };

  console.log(MarkerImage, "d");
  return (
    <div className="App">
      <div id="popup" className="ol-popup">
        <div id="popup-content">
          {exibir && (
            <div
              className="marker"
              style={{
                backgroundImage: `url(${MarkerImage})`,
              }}
            />
          )}
        </div>
      </div>

      <MapWrapper callback={callback} features={features} />
    </div>
  );
}

export default App;
