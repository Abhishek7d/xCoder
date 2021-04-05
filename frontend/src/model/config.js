let apiUrl = null;
// Url
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    apiUrl = "http://127.0.0.1:8000/api";
} else {
    apiUrl = "https://parvaty.me/api";
}

export default apiUrl