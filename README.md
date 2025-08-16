# Your IP Geolocation and Weather Information

This project is a simple web application that displays your IP-based geolocation information and current weather data. It uses the ipinfo.io API to get geolocation data and the Korean Meteorological Administration (KMA) API for weather information.

## Features

-   **IP Geolocation:** Displays your public IP address, city, region, country, and ISP.
-   **Weather Information:** Shows the current temperature, precipitation, and sky conditions for your location.
-   **Automatic Location Detection:** Uses the browser's geolocation API to get your current latitude and longitude.
-   **Coordinate Conversion:** Converts latitude and longitude to the KMA's grid system (LCC DFS) to fetch weather data.

## How to Use

1.  Clone or download the repository.
2.  Open the `index.html` file in your web browser.
3.  The browser will ask for your permission to access your location. Allow it to get weather information.
4.  Your IP geolocation and weather information will be displayed on the page.

**Note on CORS:** The KMA weather API may have Cross-Origin Resource Sharing (CORS) restrictions. If you encounter issues, you might need a browser extension to bypass these restrictions for local development. For example, you can use the "Allow CORS: Access-Control-Allow-Origin" extension for Chrome.

## API Usage

-   **ipinfo.io:** Used to get public IP address and geolocation details (city, region, country, etc.).
-   **Korean Meteorological Administration (KMA) Open API:** Used to get ultra-short-term weather forecasts (초단기실황조회).
    -   This project uses the `getUltraSrtNcst` operation.
    -   An API key is required, which is included in the `weatherAPI.js` file. **It is highly recommended to replace this with your own key for any public-facing application.**

## Project Structure

```
.
├── index.html          # The main HTML file
├── ipgeoinfo.js        # Fetches and displays IP geolocation data from ipinfo.io
├── weatherinfo.js      # Handles geolocation and converts coordinates for the weather API
├── weatherAPI.js       # Fetches and displays weather data from the KMA API
├── styles.css          # Basic styling for the application
├── js_backup/          # Backup of JavaScript files
└── OpenAPI-User-Guide(기상청_신규-동네예보정보조회서비스)_v2.5_/ # KMA API documentation
```

## Code Overview

### `index.html`

-   The main entry point of the application.
-   Includes the necessary JavaScript files (`jquery.min.js`, `weatherAPI.js`, `weatherinfo.js`, `ipgeoinfo.js`).
-   Calls `getIpGeoLocation()` and `getWeatherInfo()` on page load.
-   Contains `div` elements with specific IDs (`ip`, `city`, `region`, etc.) where the information is displayed.

### `ipgeoinfo.js`

-   `getIpGeoLocation()`:
    -   Makes an AJAX request to `https://ipinfo.io/json`.
    -   Parses the JSON response.
    -   Updates the content of the corresponding `div` elements in `index.html` with the retrieved IP and location data.

### `weatherinfo.js`

-   `dfs_xy_conv(code, v1, v2)`:
    -   Converts coordinates between latitude/longitude and the KMA's Lambert Conformal Conic (LCC) grid system.
    -   This is necessary because the KMA API requires grid coordinates (`nx`, `ny`).
-   `locationSuccess(p)`:
    -   Callback function that is executed when the browser successfully gets the user's location.
    -   It retrieves the latitude and longitude, converts them to grid coordinates using `dfs_xy_conv`, and then (in the original full code) would call the `Weather()` function.
-   `getWeatherInfo()`:
    -   Uses `navigator.geolocation.getCurrentPosition()` to request the user's location.

### `weatherAPI.js`

-   `Weather(nx, ny)`:
    -   Takes the KMA grid coordinates (`nx`, `ny`) as input.
    -   Constructs the API request URL for the KMA's `getUltraSrtNcst` service.
    -   Makes an AJAX request to the KMA API.
    -   Parses the response and updates the weather information on the page.
    -   **Note:** The current implementation in the provided file has some hardcoded and commented-out parts, and the API key is visible.

### `js_backup` Folder

This folder contains previous versions and alternative implementations of the core JavaScript files.

-   **`conversion.js`**: Contains only the `dfs_xy_conv` function for coordinate conversion, separated from the geolocation logic.
-   **`weather1st.js`**: An alternative version for fetching weather data using jQuery's `$.ajax` method.
-   **`weather2nd.js`**: Another alternative version using `$.ajax` with slightly different response handling.
-   **`weather3rd.js`**: An alternative version using the native `XMLHttpRequest` object for the AJAX request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.