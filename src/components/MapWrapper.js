import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { toLonLat, transform } from "ol/proj";
import { toStringHDMS, toStringXY } from "ol/coordinate";
import { Overlay } from "ol";

function MapWrapper({ features, callback }) {
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const [selectedCoord, setSelectedCoord] = useState();

  const mapElement = useRef();

  const mapRef = useRef();

  mapRef.current = map;

  const overlay = new Overlay({
    id: "info",
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  useEffect(() => {
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
    });

    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
          }),
        }),
      ],
      view: new View({
        projection: "EPSG:3857",
        center: [0, 0],
        zoom: 2,
      }),
      controls: [],
      overlays: [overlay],
    });

    initialMap.on("singleclick", handleMapClick);

    setMap(initialMap);
    setFeaturesLayer(initalFeaturesLayer);
  }, []);

  useEffect(() => {
    if (features.length) {
      featuresLayer.setSource(
        new VectorSource({
          features: features,
        })
      );

      map.getView().fit(featuresLayer.getSource().getExtent(), {
        padding: [100, 100, 100, 100],
      });
    }
  }, [features]);

  const handleMapClick = (event) => {
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

    const transormedCoord = transform(clickedCoord, "EPSG:3857", "EPSG:4326");

    setSelectedCoord(transormedCoord);

    const coordinate = event.coordinate;
    const hdms = toStringHDMS(toLonLat(coordinate));

    callback(hdms);
    overlay.setPosition(coordinate);
  };

  useEffect(() => {
    overlay.setElement(document.getElementById("popup"));
  }, []);

  return (
    <div>
      <div ref={mapElement} className="map-container"></div>

      <div className="clicked-coord-label">
        <p>{selectedCoord ? toStringXY(selectedCoord, 5) : ""}</p>
      </div>
    </div>
  );
}

export default MapWrapper;
