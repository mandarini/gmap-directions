export function loadMapScript(libraries: string, c: Function): void {
  if (!document.getElementById("gmap")) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDeG77r1asgi9uVe4S5Y7easEUmb1Vsw4c";
    if (libraries && libraries.length > 0) {
      script.src = script.src + "&libraries=" + libraries;
    }
    script.id = "gmap";
    script.addEventListener(
      "load",
      e => {
        c(e);
      },
      false
    );
    document.body.appendChild(script);
  }
}
