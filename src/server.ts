import dotenv from 'dotenv';
import app from "./app";
import settings from './core/config/settings';

//For env File 
dotenv.config();

const server = app;
const port = settings.serverPort || 8000;


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});