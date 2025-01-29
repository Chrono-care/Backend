import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forumsController } from './forums.controller';
import { ForumsService } from './forums.service';
import { Forum } from './entities/forum.entity';
import { Subscribe } from './entities/subscribe.entity';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Forum, Subscribe])],
  controllers: [forumsController],
  providers: [ForumsService],
})
export class forumsModule {}
