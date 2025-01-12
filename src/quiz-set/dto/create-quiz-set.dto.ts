import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QuizDifficulty } from 'src/enum/questions.enum';
import { CreateQuestionDto } from 'src/questions/dto/create-question.dto';

export class CreateQuizSetDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(QuizDifficulty)
  difficulty: QuizDifficulty;

  @IsArray()
  quizzes: CreateQuestionDto[];
}
