import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsMongoId,
} from 'class-validator';
import { QuizDifficulty, QuizQuestionType } from 'src/enum/questions.enum';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  options: string[];

  @IsInt()
  @Min(0)
  correctIndex: number;

  @IsString()
  hint: string;

  @IsEnum(QuizQuestionType)
  questionType: QuizQuestionType;

  @IsEnum(QuizDifficulty)
  difficulty: QuizDifficulty;

  //@IsMongoId()
  quizSet: string;
}
