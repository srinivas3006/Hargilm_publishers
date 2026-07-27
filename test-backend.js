const axios = require("axios");

async function run() {
  const base = "https://harglimpublish-backend.onrender.com/api";
  try {
    const res = await axios.get(`${base}/admin/publish-requests`);
    console.log(`[SUCCESS] GET /admin/publish-requests - Type: ${typeof res.data} - IsArray: ${Array.isArray(res.data)}`);
    console.log(res.data);
  } catch (err) {
    console.log(`[FAIL] GET /admin/publish-requests - Status: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
  }
}

run();
