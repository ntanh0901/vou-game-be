import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ResponseMessage } from '../decorators/response-message.decorator';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ResponseMessage('Question created successfully')
  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @ResponseMessage('Questions get successfully')
  @Get()
  async getQuestions() {
    return this.questionsService.getQuestions();
  }

  @ResponseMessage('Question get by id successfully')
  @Get(':id')
  async getQuestionById(id: string) {
    return this.questionsService.getQuestionById(id);
  }

  @ResponseMessage('Question updated successfully')
  @Patch(':id')
  async updateQuestion(
    @Body() updateQuestionDto: CreateQuestionDto,
    id: string,
  ) {
    return this.questionsService.updateQuestion(id, updateQuestionDto);
  }

  @ResponseMessage('Question deleted successfully')
  @Delete(':id')
  async deleteQuestion(id: string) {
    return this.questionsService.deleteQuestion(id);
  }
}
