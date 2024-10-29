import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forumsController } from './forums.controller';
import { forumsService } from './forums.service';
import { Forum } from './entities/forum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forum])],
  controllers: [forumsController],
  providers: [forumsService],
})
export class forumsModule {}
