import dotenv from 'dotenv';

dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: required('CLIENT_ORIGIN', 'http://localhost:5173'),
  adminEmail: required('ADMIN_EMAIL', 'admin@marketplace.local'),
  adminPassword: required('ADMIN_PASSWORD', 'ChangeThisNow!123'),
  jwtSecret: required('JWT_SECRET', 'replace_this_with_a_long_random_secret'),
  encryptionKeyHex: required(
    'DATA_ENCRYPTION_KEY',
    '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff'
  )
};
