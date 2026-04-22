import { spawn } from 'child_process';
import fs from 'fs';

const prisma = spawn('npx', ['prisma', 'db', 'push', '--accept-data-loss']);

let output = '';
let error = '';

prisma.stdout.on('data', (data) => {
  output += data.toString();
  console.log(data.toString());
});

prisma.stderr.on('data', (data) => {
  error += data.toString();
  console.error(data.toString());
});

prisma.on('close', (code) => {
  fs.writeFileSync('db_push_debug.txt', `Exit Code: ${code}\n\nSTDOUT:\n${output}\n\nSTDERR:\n${error}`);
  console.log('Done. Check db_push_debug.txt');
});
