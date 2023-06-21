import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AtmModule } from './atm.module';
import { VersioningType } from '@nestjs/common';
import { EnvConfigService } from './env-config/env-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AtmModule);
  const isProdZone = app.get(EnvConfigService).zone == 'prod';
  app.enableVersioning({ type: VersioningType.URI });

  if (!isProdZone) {
    SwaggerModule.setup(
      'api',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('atm Service')
          .setDescription('The atm API description')
          .setVersion('0.1')
          .build(),
      ),
    );
  }

  await app.listen(3000);
}
bootstrap();
