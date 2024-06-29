const { http, https } = require('follow-redirects');

// Function to get the final URL from a short URL
const getFinalUrl = async (shortUrl) => {
    return new Promise((resolve, reject) => {
        const url = new URL(shortUrl);
        const protocol = url.protocol === 'https:' ? https : http;
        
        protocol.get(shortUrl, (response) => {
            resolve(response.responseUrl);
        }).on('error', (err) => {
            reject(err);
        });
    });
};

// Function to extract coordinates from a URL
const extractCoordinates = (url) => {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const matches = url.match(regex);
    if (matches) {
        return {
            latitude: parseFloat(matches[1]),
            longitude: parseFloat(matches[2])
        };
    } else {
        throw new Error('Coordinates not found in URL');
    }
};

// Function to get coordinates from a short URL
const getCoordinatesFromShortUrl = async (shortUrl) => {
    try {
        const finalUrl = await getFinalUrl(shortUrl);
        const coordinates = extractCoordinates(finalUrl);
        return coordinates;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// Haversine formula to calculate the distance between two coordinates
const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371.0; // Radius of the Earth in kilometers
    const toRadians = angle => angle * (Math.PI / 180);
    const lat1_rad = toRadians(lat1);
    const lon1_rad = toRadians(lon1);
    const lat2_rad = toRadians(lat2);
    const lon2_rad = toRadians(lon2);
    const dlat = lat2_rad - lat1_rad;
    const dlon = lon2_rad - lon1_rad;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

// Variables with map URLs
let a = 'https://maps.app.goo.gl/msbDjQovmWMJCWyP6';
let b = 'https://maps.app.goo.gl/VbGYVFwrLPqqzDmX6';

// Calculate distance between coordinates from URLs
const calculateDistanceBetweenUrls = async (url1, url2) => {
    const coords1 = await getCoordinatesFromShortUrl(url1);
    const coords2 = await getCoordinatesFromShortUrl(url2);
    console.log(coords1)
    console.log(coords2)

    if (coords1 && coords2) {
        const distance = haversine(coords1.latitude, coords1.longitude, coords2.latitude, coords2.longitude);
        console.log(`Distance between points: ${distance.toFixed(2)} km`);
    } else {
        console.log('Could not retrieve coordinates for one or both URLs.');
    }
};

calculateDistanceBetweenUrls(a, b);
