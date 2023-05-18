import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { InfoService } from './info.service'
import { InfoController } from './info.controller'
import { Info } from './info.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Info])],
  providers: [InfoService],
  controllers: [InfoController]
})
export class InfoModule { }