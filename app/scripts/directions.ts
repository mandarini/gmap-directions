export function directionCalculator(map: google.maps.Map) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  let chosenTravelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING;

  const service: google.maps.DistanceMatrixService = new google.maps.DistanceMatrixService();

  const autocomplete_input_origin: HTMLInputElement = document.getElementById(
    "origin",
  ) as HTMLInputElement;
  const autocomplete_input_destination: HTMLInputElement = document.getElementById(
    "destination",
  ) as HTMLInputElement;
  const onChangeHandler = () => {
    calculateAndDisplayRoute(
      directionsService,
      directionsRenderer,
      service,
      autocomplete_input_origin,
      autocomplete_input_destination,
      chosenTravelMode,
    );
  };

  const autocomplete_origin = new google.maps.places.Autocomplete(
    autocomplete_input_origin,
  );
  const autocomplete_destination = new google.maps.places.Autocomplete(
    autocomplete_input_destination,
  );

  autocomplete_origin.bindTo("bounds", map);
  autocomplete_destination.bindTo("bounds", map);

  autocomplete_origin.setFields([
    "address_components",
    "geometry",
    "icon",
    "name",
  ]);
  autocomplete_destination.setFields([
    "address_components",
    "geometry",
    "icon",
    "name",
  ]);

  autocomplete_origin.addListener("place_changed", () => {
    const place = autocomplete_origin.getPlace();
    onChangeHandler();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
  });

  autocomplete_destination.addListener("place_changed", () => {
    const place = autocomplete_destination.getPlace();
    onChangeHandler();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
  });

  document
    .getElementById("use-strict-bounds")
    .addEventListener("change", (event) => {
      console.log(event);
      const target: HTMLInputElement = event.target as HTMLInputElement;
      autocomplete_origin.setOptions({ strictBounds: target.checked });
      autocomplete_destination.setOptions({ strictBounds: target.checked });
    });

  const radios: NodeListOf<HTMLInputElement> = document.getElementsByName(
    "directionsMode",
  ) as NodeListOf<HTMLInputElement>;

  for (var i = 0, length = radios.length; i < length; i++) {
    radios[i].addEventListener("change", (event) => {
      console.log(event, radios[i]);
      const target: HTMLInputElement = event.target as HTMLInputElement;
      console.log(target.id, target.value);
      chosenTravelMode = target.value as google.maps.TravelMode;
    });
  }
}

function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  service: google.maps.DistanceMatrixService,
  origin: HTMLInputElement,
  destination: HTMLInputElement,
  chosenTravelMode: google.maps.TravelMode,
) {
  if (
    origin.value &&
    origin.value.length > 0 &&
    destination.value &&
    destination.value.length > 0
  ) {
    directionsService.route(
      {
        origin: { query: origin.value },
        destination: { query: destination.value },
        travelMode: chosenTravelMode,
      },
      (response: any, status: any) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          service.getDistanceMatrix(
            {
              origins: [origin.value],
              destinations: [destination.value],
              travelMode: chosenTravelMode,
              unitSystem: google.maps.UnitSystem.METRIC,
            },
            (response, status) => {
              if (status !== "OK") {
                alert("Error was: " + status);
              } else {
                (document.getElementById(
                  "distance",
                ) as HTMLSpanElement).textContent =
                  response.rows[0].elements[0].distance.text +
                  " " +
                  response.rows[0].elements[0].duration.text;
              }
            },
          );
        } else {
          window.alert("Directions request failed due to " + status);
        }
      },
    );
  }
}
