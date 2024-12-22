import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Get()
  async getQuestions() {
    return this.questionsService.getQuestions();
  }

  @Get(':id')
  async getQuestionById(id: string) {
    return this.questionsService.getQuestionById(id);
  }

  @Patch(':id')
  async updateQuestion(
    @Body() updateQuestionDto: CreateQuestionDto,
    id: string,
  ) {
    return this.questionsService.updateQuestion(id, updateQuestionDto);
  }

  @Delete(':id')
  async deleteQuestion(id: string) {
    return this.questionsService.deleteQuestion(id);
  }
}
