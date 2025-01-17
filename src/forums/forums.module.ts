import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forumsController } from './forums.controller';
import { ForumsService } from './forums.service';
import { Forum } from './entities/forum.entity';
import { Subscribe } from './entities/subscribe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forum, Subscribe])],
  controllers: [forumsController],
  providers: [ForumsService],
})
export class forumsModule {}
