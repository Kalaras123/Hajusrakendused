async function fetchWeatherData() {

    try {
        const response = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.437&lon=24.7536');
        const data = await response.json();

        const timeseries = data.properties.timeseries;

        timeseries.forEach(entry => {
            const time = entry.time;
            const temperature = entry.data.instant.details.air_temperature;

            console.log(`${time}: ${temperature}C`);
        }
        );

    } catch (error) {
        console.error("Ei saa infot kätte:", error);
    }
}

fetchWeatherData();