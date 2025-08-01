const dotenv = require('dotenv');
const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_NAME: Joi.string().required().description('Mongo DB name'),
  })
  .unknown();

function createConfig (configPath) {
  dotenv.config({ path: configPath });

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    port: envVars.PORT,
    mongo: {
      url: envVars.MONGODB_URL,
      dbName: envVars.MONGODB_NAME,
    }
  };
}

module.exports = {
  createConfig,
};
