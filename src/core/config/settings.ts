import { ServerSettings } from "../../models/interfaces/settings.interface";

const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    SERVER_ENVIRONMENT: Joi.string()
      .valid("PRODUCTION", "STAGING", "DEVELOPMENT", "TEST")
      .required(),
    SERVER_PORT: Joi.number().default(8000),
    DATABASE_HOST: Joi.string().description(
      "database server that will host the backend database"
    ),
    DATABASE_PORT: Joi.number().description(
      "port to connect to the database server"
    ),
    DATABASE_NAME: Joi.string().description("name of database"),
    DATABASE_USERNAME: Joi.string().description("username for database server"),
    DATABASE_PASSWORD: Joi.string().description("password for database server"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const serverSettings: ServerSettings = {
  serverEnvironment: envVars.SERVER_ENVIRONMENT,
  serverPort: envVars.SERVER_PORT,
  databaseHost: envVars.DATABASE_HOST,
  databasePort: envVars.DATABASE_PORT,
  databaseUsername: envVars.DATABASE_USERNAME,
  databasePassword: envVars.DATABASE_PASSWORD,
  databaseName: envVars.DATABASE_NAME,
  jwtSecretKey: envVars.JWT_SECRET_KEY,
  bcryptHashingSalt: envVars.BCRYPT_HASHING_SALT
};

export default serverSettings;
