import axios from "axios";

const API_KEY = "rRpx6RkpUSS575MIKjPweP3qtl0HeKFDfGr7rgjE";
const BASE_URL = "https://api.nasa.gov/neo/rest/v1";

export async function fetchNeoData(startDate, endDate) {
  try {
    const res = await axios.get(`${BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: API_KEY,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching NEO data:", err);
    return null;
  }
}
