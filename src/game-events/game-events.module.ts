import { Module } from '@nestjs/common';
import { GameEventsService } from './game-events.service';
import { GameEventsGateway } from './game-events.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './game-events.schema';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    QuestionsModule,
  ],
  providers: [GameEventsGateway, GameEventsService],
})
export class GameEventsModule {}
