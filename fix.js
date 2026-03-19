const { execSync } = require('child_process');
const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
schema = schema.replace(/\r/g, ''); // Fix Windows CRLF breaking Prisma parser
schema = schema.replace(/url\s*=\s*.*/, 'url = "file:./dev.db"'); // Hardcode safely
fs.writeFileSync('prisma/schema.prisma', schema);

try {
  const output = execSync('npx prisma db push', { stdio: 'pipe' });
  console.log("SUCCESS:");
  console.log(output.toString());
} catch (e) {
  console.log("ERROR:");
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.log(e.stderr.toString());
}
