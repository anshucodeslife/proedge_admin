import axios from 'axios';

const url = 'https://backend.proedgelearning.in/auth/signup';

const payloads = [
  { email: 'admin_probe@proedge.com', password: 'password123', fullName: 'Admin Probe' },
  { email: 'admin_probe@proedge.com', password: 'password123', name: 'Admin Probe' },
  { email: 'admin_probe@proedge.com', password: 'password123', firstName: 'Admin', lastName: 'Probe' },
  { email: 'admin_probe@proedge.com', password: 'password123', fullName: 'Admin Probe', role: 'admin' },
  { email: 'admin_probe@proedge.com', password: 'password123' }
];

async function debug() {
  console.log(`Debugging ${url}...`);
  for (const [i, payload] of payloads.entries()) {
    try {
      console.log(`\nTest ${i + 1}: Sending payload:`, payload);
      const res = await axios.post(url, payload);
      console.log(`[SUCCESS] Status: ${res.status}`);
      console.log('Response:', res.data);
      break; // Stop if success
    } catch (error) {
       if (error.response) {
         console.log(`[FAILED] Status: ${error.response.status}`);
         console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
       } else {
         console.log(`[ERROR] ${error.message}`);
       }
    }
  }
}

debug();
