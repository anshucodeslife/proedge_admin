import axios from 'axios';

const url = 'https://backend.proedgelearning.in/auth/signup';

const adminUser = {
  email: 'admin@proedge.com',
  password: 'admin123',
  fullName: 'System Admin',
  role: 'ADMIN'
};

async function createAdmin() {
  console.log('Creating Admin User:', adminUser.email);
  try {
    const res = await axios.post(url, adminUser);
    console.log('[SUCCESS] Admin user created successfully!');
    console.log('Role:', res.data.data.user.role);
    console.log('You can now login with these credentials.');
  } catch (error) {
    if (error.response) {
      console.log(`[FAILED] Status: ${error.response.status}`);
      console.log('Message:', error.response.data.message || JSON.stringify(error.response.data));
      if (error.response.status === 400 || error.response.data.message?.includes('already exists')) {
        console.log('It seems this user already exists. Try logging in.');
      }
    } else {
      console.log('[ERROR]', error.message);
    }
  }
}

createAdmin();
