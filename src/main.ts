import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }))
  await app.listen(3000, '192.168.1.64' || 'localhost')
}
bootstrap()