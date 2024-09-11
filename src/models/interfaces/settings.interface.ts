export interface ServerSettings {
  serverEnvironment: "PRODUCTION" | "STAGING" | "DEVELOPMENT" | "TEST";
  serverPort: number;
  databaseHost: string;
  databasePort: number;
  databaseUsername: string;
  databasePassword: string;
  databaseName: string;
  jwtSecretKey: string;
  bcryptHashingSalt: string;

}
