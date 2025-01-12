import { PartialType } from '@nestjs/swagger';
import { CreateQuizSetDto } from './create-quiz-set.dto';

export class UpdateQuizSetDto extends PartialType(CreateQuizSetDto) {}
