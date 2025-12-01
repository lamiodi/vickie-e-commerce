import { env } from './config/env.js';
import app from './app.js';

app.disable('x-powered-by');

if (env.nodeEnv !== 'test') {
  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });

  const gracefulShutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
    });

    // Force close server after 10s
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}
