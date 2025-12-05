import axios from 'axios';

const url = 'https://backend.proedgelearning.in/auth/signup';

async function attemptAdmin() {
  const email = `admin_req_${Date.now()}@proedge.com`; // Unique email
  const payload = { 
    email, 
    password: 'password123', 
    fullName: 'Admin Request',
    role: 'ADMIN'
  };

  console.log('Sending payload:', payload);
  try {
    const res = await axios.post(url, payload);
    console.log('[SUCCESS] Created user:', res.data.data.user.email);
    console.log('Assigned Role:', res.data.data.user.role);
  } catch (error) {
    if (error.response) {
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

attemptAdmin();
