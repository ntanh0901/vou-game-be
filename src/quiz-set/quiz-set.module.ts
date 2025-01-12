import { Module } from '@nestjs/common';
import { QuizSetService } from './quiz-set.service';
import { QuizSetController } from './quiz-set.controller';
import { QuestionsModule } from 'src/questions/questions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSet, QuizSetSchema } from './quiz-set.schema';

@Module({
  imports: [
    QuestionsModule,
    MongooseModule.forFeature([{ name: QuizSet.name, schema: QuizSetSchema }]),
  ],
  controllers: [QuizSetController],
  providers: [QuizSetService],
})
export class QuizSetModule {}
