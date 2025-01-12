import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { QuizDifficulty } from '../enum/questions.enum';

export type QuizSetDocument = QuizSet & Document;

@Schema()
export class QuizSet {
  @Prop({ required: true })
  event: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: QuizDifficulty })
  difficulty: QuizDifficulty;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }] })
  quizzes: Types.ObjectId[];
}

export const QuizSetSchema = SchemaFactory.createForClass(QuizSet);
