// question.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswerIndex: number;

  @Prop({ required: true })
  event: string;

  @Prop({ required: true })
  index: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
