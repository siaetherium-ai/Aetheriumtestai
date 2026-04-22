import fs from 'fs';

let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// 1. Remove all @@schema tags to start fresh
content = content.replace(/\s+@@schema\("public"\)/g, '');
content = content.replace(/\s+@@schema\("auth"\)/g, '');

// 2. Fix corrupted lines like @default("{  ...")
content = content.replace(/@default\("\{  \n\}"\)/g, '@default("{}")');
content = content.replace(/@default\("\{ \n\}"\)/g, '@default("{}")');
// Specifically fix the one I saw: @default("{  \n}")
content = content.replace(/@default\("\{[\s\S]+?\}"\)/g, '@default("{}")');

fs.writeFileSync('prisma/schema.prisma', content);
console.log('Cleaned schema.prisma');
