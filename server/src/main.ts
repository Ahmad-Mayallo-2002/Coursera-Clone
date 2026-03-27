import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import helmet from 'helmet';
import { LoggingInterceptor } from './logging/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });
  await redisClient.connect();

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(helmet());
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credential: true,
    origin: 'http://localhost:5173',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('http://localhost:3000');
}
bootstrap();
