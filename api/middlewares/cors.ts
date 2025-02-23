import cors from 'cors';
import { config } from 'config/index';

const corsOptions = cors({
  origin: `http://localhost:${config.vitePort}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
});

export default corsOptions;
