const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs').promises;

async function getSecret(projectId, secretId) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretId}/versions/latest`,
  });

  return version.payload.data.toString('utf-8');
}

async function writeToFile(data, filename) {
  await fs.writeFile(filename, data);
}

async function main() {
  // Replace these with your values
  const projectId = process.env.PROJECT_ID;
  const secretId = process.env.SECRET_NAME;
  const outputFile = process.env.ENV_FILE_PATH || '.env';

  try {
    // Fetch the secret data
    const secretData = await getSecret(projectId, secretId);

    // Write the secret data to a file
    await writeToFile(secretData, outputFile);

    console.log(`Secret data written to ${outputFile}`);
  } catch (error) {
    console.error('Error:', error.message || error);
  }
}

main();
