import 'dotenv/config';
import '../src/config/firebase.js';
import { adminAuth } from '../src/config/firebase.js';

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run admin:grant -- <email>');
  process.exit(1);
}

try {
  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { admin: true, role: 'admin' });
  console.log(`Admin claim set for ${email}. The user must sign in again to refresh their token.`);
} catch (err) {
  console.error('Failed to set admin claim:', err);
  process.exit(1);
}
