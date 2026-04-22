import fs from 'fs';

const authEntities = [
  'audit_log_entries', 'custom_oauth_providers', 'flow_state', 'identities', 'instances', 
  'mfa_amr_claims', 'mfa_challenges', 'mfa_factors', 'oauth_authorizations', 
  'oauth_client_states', 'oauth_clients', 'oauth_consents', 'one_time_tokens', 
  'refresh_tokens', 'saml_providers', 'saml_relay_states', 'schema_migrations', 
  'sessions', 'sso_domains', 'sso_providers', 'users', 'webauthn_challenges', 'webauthn_credentials',
  'aal_level', 'code_challenge_method', 'factor_status', 'factor_type', 'oauth_authorization_status',
  'oauth_client_type', 'oauth_registration_type', 'oauth_response_type', 'one_time_token_type'
];

let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// 1. Remove ALL @@schema tags
content = content.replace(/\s+@@schema\(".*?"\)/g, '');

// 2. Process line by line to add them back
let lines = content.split('\n');
let newLines: string[] = [];
let currentEntity: string | null = null;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  const modelMatch = line.match(/^(model|enum)\s+(\w+)\s+\{/);
  if (modelMatch) {
    currentEntity = modelMatch[2];
  }
  
  if (currentEntity && line.trim() === '}') {
    // End of entity
    const schema = authEntities.includes(currentEntity) ? 'auth' : 'public';
    newLines.push(`  @@schema("${schema}")`);
    newLines.push(line);
    currentEntity = null;
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync('prisma/schema.prisma', newLines.join('\n'));
console.log('Processed schema.prisma cleaned and reapplied');
