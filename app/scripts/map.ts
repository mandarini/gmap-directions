/// <reference types="@types/markerclustererplus" />
import {} from "google-maps";
import * as styledMap from "./styledMap";
import { directionCalculator } from "./directions";

let this_map: google.maps.Map;
let warsaw: google.maps.LatLng;

export function FunWithMaps(map: google.maps.Map) {
  this_map = map;
  warsaw = coords(52.2375313, 21.0172313);
  let darkmap = new google.maps.StyledMapType(
    styledMap.styledMap as google.maps.MapTypeStyle[],
    {
      name: "Dark Map",
    },
  );

  map.setCenter(warsaw);
  map.mapTypes.set("dark_map", darkmap);
  map.setMapTypeId("dark_map");

  map.controls[google.maps.ControlPosition.LEFT_TOP].push(
    document.getElementById("controls"),
  );

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
    document.getElementById("katlink"),
  );
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    document.getElementById("place-search"),
  );

  directionCalculator(map);
}

function coords(x: number, y: number) {
  return new google.maps.LatLng(x, y);
}
