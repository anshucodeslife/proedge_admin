import axios from 'axios';

const baseURL = 'https://backend.proedgelearning.in';

const endpoints = [
  '/auth/register',
  '/auth/signup',
  '/auth/admin/register',
  '/auth/admin/signup',
  '/admin/register',
  '/admin/signup',
  '/users/register',
  '/users'
];

async function probe() {
  console.log(`Probing ${baseURL}...`);
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing POST ${endpoint}...`);
      await axios.post(`${baseURL}${endpoint}`, {
        email: 'test_probe_admin@proedge.com',
        password: 'password123',
        fullName: 'Probe Admin',
        role: 'admin'
      });
      console.log(`[SUCCESS] Found endpoint: ${endpoint}`);
    } catch (error) {
       if (error.response) {
         console.log(`[FAILED] ${endpoint} - Status: ${error.response.status} - ${error.response.statusText}`);
         // If 400 or 422, it means the endpoint exists but data was wrong/incomplete, which is a good sign!
         if (error.response.status === 400 || error.response.status === 422) {
             console.log(`[POTENTIAL MATCH] ${endpoint} might exist but rejected payload.`);
         }
       } else {
         console.log(`[ERROR] ${endpoint} - ${error.message}`);
       }
    }
  }
}

probe();
