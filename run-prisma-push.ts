import { execSync } from 'child_process';
import fs from 'fs';

try {
  console.log('Running prisma db push...');
  const output = execSync('npx prisma db push --accept-data-loss', { encoding: 'utf-8' });
  console.log('Output:', output);
} catch (error: any) {
  console.error('DIAGNOSTIC_ERROR_START');
  fs.writeFileSync('db_push_error.txt', error.stdout + '\n' + error.stderr);
  console.error('Error written to db_push_error.txt');
  console.error('DIAGNOSTIC_ERROR_END');
}
