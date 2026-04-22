import axios from 'axios';

async function main() {
  const url = 'http://localhost:3000/api/auth/login';
  const credentials = {
    email: 's.iaetherium@gmail.com',
    password: 'Aetherium2026!'
  };

  try {
    console.log('--- ATTEMPTING LOGIN ---');
    const response = await axios.post(url, credentials);
    console.log('STATUS:', response.status);
    console.log('DATA:', JSON.stringify(response.data, null, 2));
    console.log('--- LOGIN SUCCESSFUL ---');
  } catch (error: any) {
    console.error('--- LOGIN FAILED ---');
    if (error.response) {
      console.error('STATUS:', error.response.status);
      console.error('DATA:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('MESSAGE:', error.message);
    }
    console.log('--------------------');
  }
}

main();
