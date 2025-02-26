import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import styles from "./styles.module.scss";
import "leaflet/dist/leaflet.css";
import regionData from "./Sakha_Yakutia.json";
import { useEffect, useState } from "react";

type GeoJsonObjectType = {
  type: "Feature";
  properties: {
    name: string;
    cartodb_id: number;
    created_at: string;
    updated_at: string;
    name_latin: string;
  };
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
};

interface Props {
  cords: [number, number];
  name: string;
}

const customIcon = new L.Icon({
  iconUrl: "/marker.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function Map(props: Props) {
  const { cords, name } = props;
  const [isFirstRender, setIsFirstRender] = useState(true);

  // const zoomInClickHandler = () => {
  //   const zoomIn = document.getElementsByClassName(
  //     "leaflet-control-zoom-in"
  //   )[0] as HTMLElement;

  //   zoomIn.click();
  // };

  // const zoomOutClickHandler = () => {
  //   const zoomOut = document.getElementsByClassName(
  //     "leaflet-control-zoom-out"
  //   )[0] as HTMLElement;

  //   zoomOut.click();
  // };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      (
        document.getElementsByClassName(
          "leaflet-bottom leaflet-right"
        )[0] as HTMLElement
      ).style.display = "none";

      const obj = document.getElementsByClassName(
        "leaflet-top leaflet-right"
      )[0] as HTMLElement;

      obj.style.display = "none";
    }
  }, [isFirstRender]);

  return (
    <section className={styles.map}>
      <MapContainer
        className={styles.map__leaflet}
        zoom={3}
        center={[65.735295, 129.114512]}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        maxBounds={[
          [-90, -180], // Юго-западный угол
          [90, 190], // Северо-восточный угол
        ]}
        maxBoundsViscosity={1.0} // Насколько строго придерживаться границ
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Marker position={cords} icon={customIcon}>
          <Popup className={styles.popup}>
            <p>{name}</p>
          </Popup>
        </Marker>

        <GeoJSON
          data={regionData as GeoJsonObjectType}
          style={{ color: "#7653c8", fillColor: "#9c9ff1", fillOpacity: 0.5 }}
        />

        {/* <ZoomControl position="topright" /> */}
        {/* <div className={styles.zoom_btn_cont}>
        <button className={styles.zoom_btn} onClick={zoomInClickHandler}>
          +
        </button>

        <button className={styles.zoom_btn} onClick={zoomOutClickHandler}>
          -
        </button>
      </div> */}
      </MapContainer>
    </section>
  );
}

export default Map;
