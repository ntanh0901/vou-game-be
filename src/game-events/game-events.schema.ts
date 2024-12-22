import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: 0 })
  points: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
