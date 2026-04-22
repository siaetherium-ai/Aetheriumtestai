import fs from 'fs';

let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Regex to find model blocks and add @@schema("public") if not present
const modelRegex = /model (\w+) \{([\s\S]+?)\}/g;

content = content.replace(modelRegex, (match, name, body) => {
  if (body.includes('@@schema')) return match;
  // Add it before the closing brace
  return `model ${name} {${body}  @@schema("public")\n}`;
});

fs.writeFileSync('prisma/schema.prisma', content);
console.log('Processed schema.prisma');
