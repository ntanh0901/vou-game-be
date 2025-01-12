import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { QuizDifficulty, QuizQuestionType } from '../enum/questions.enum';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctIndex: number;

  @Prop()
  hint: string;

  @Prop({ required: true, enum: QuizQuestionType })
  questionType: QuizQuestionType;

  @Prop({ required: true, enum: QuizDifficulty })
  difficulty: QuizDifficulty;

  @Prop({ type: Types.ObjectId, ref: 'QuizSet', required: true })
  quizSet: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
