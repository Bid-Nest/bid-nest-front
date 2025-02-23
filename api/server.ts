import { connectToDatabase } from './database';
import { createServer } from 'http';
import app from 'src/app';
import { config } from 'config/index';
import { initializeSocket } from 'src/socket';

const server = createServer(app);

app.listen(config.port, async () => {
  const currentDate = new Date().toLocaleString();
  console.log(`✅ Environment: ${config.nodeEnv.toUpperCase()}`);
  await connectToDatabase();
  initializeSocket(server);
  console.log(`✅ Socket.IO server initialized and listening for connections.`);
  let serverUrl =
    config.nodeEnv === 'production'
      ? `https://${config.host}${config.port && config.port != 443 ? `:${config.port}` : ''}`
      : `http://localhost:${config.port}`;

  console.log(`✅ Server is live at ${serverUrl} on ${currentDate}`);
});
