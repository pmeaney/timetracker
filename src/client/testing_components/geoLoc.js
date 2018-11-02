    // Test: Geolocation
    // src: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

    // function geoFindMe() {

    //   if (!navigator.geolocation) {
    //     console.log("Geolocation is not supported by your browser")
    //     return;
    //   }

    //   function success(position) {
    //     var latitude = position.coords.latitude;
    //     var longitude = position.coords.longitude;

    //     console.log('Latitude is ' + latitude + '° Longitude is ' + longitude + '...')

    //     // var img = new Image();
    //     // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
    //     // output.appendChild(img);
    //   }

    //   function error() {
    //     console.log("Unable to retrieve your location")
    //   }

    //   console.log("Locating...")

    //   navigator.geolocation.getCurrentPosition(success, error);
    // }

    // geoFindMe()