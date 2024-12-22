import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  text: string;
  @IsString({ each: true })
  options: string[];
  @IsNumber()
  correctAnswerIndex: number;
  @IsString()
  event: string;
  @IsNumber()
  index: number;
}
