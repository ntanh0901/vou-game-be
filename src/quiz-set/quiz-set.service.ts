import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuizSetDto } from './dto/create-quiz-set.dto';
import { UpdateQuizSetDto } from './dto/update-quiz-set.dto';
import { QuizSet, QuizSetDocument } from './quiz-set.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { CreateQuestionDto } from 'src/questions/dto/create-question.dto';
import { QuestionDocument } from 'src/questions/questions.schema';

@Injectable()
export class QuizSetService {
  constructor(
    private readonly questionsService: QuestionsService,
    @InjectModel(QuizSet.name) private quizSetModel: Model<QuizSetDocument>,
  ) {}

  async create(createQuizSetDto: CreateQuizSetDto): Promise<QuizSet> {
    const { quizzes, ...quizSetData } = createQuizSetDto;
    const createdQuizSet = new this.quizSetModel(quizSetData);
    const savedQuizSet = await createdQuizSet.save();

    const questionIds = [];
    for (const quiz of quizzes) {
      const createQuestionDto: CreateQuestionDto = {
        ...quiz,
        quizSet: savedQuizSet._id as string,
      };
      const createdQuestion: QuestionDocument =
        await this.questionsService.createQuestion(createQuestionDto);
      questionIds.push(createdQuestion._id);
    }

    savedQuizSet.quizzes = questionIds;
    await savedQuizSet.save();

    return savedQuizSet;
  }

  async getAllQuesionsOfQuizSet(quizSetId: string) {
    const quizSet = await this.quizSetModel
      .findById(quizSetId)
      .populate('quizzes')
      .exec();
    if (!quizSet) {
      throw new NotFoundException(`QuizSet with ID ${quizSetId} not found`);
    }
    const allQuestions = quizSet.quizzes;
    let questions = [];
    for (const question of allQuestions) {
      questions.push(
        await this.questionsService.getQuestionById(question._id.toString()),
      );
    }
    return questions;
  }

  async findAll(): Promise<QuizSet[]> {
    return this.quizSetModel.find().populate('quizzes').exec();
  }

  async findOne(id: string): Promise<QuizSet> {
    const quizSet = await this.quizSetModel
      .findById(id)
      .populate('quizzes')
      .exec();
    if (!quizSet) {
      throw new NotFoundException(`QuizSet with ID ${id} not found`);
    }
    return quizSet;
  }

  async update(
    id: string,
    updateQuizSetDto: UpdateQuizSetDto,
  ): Promise<QuizSet> {
    const updatedQuizSet = await this.quizSetModel
      .findByIdAndUpdate(id, updateQuizSetDto, { new: true })
      .exec();
    if (!updatedQuizSet) {
      throw new NotFoundException(`QuizSet with ID ${id} not found`);
    }
    return updatedQuizSet;
  }

  async remove(id: string): Promise<QuizSet> {
    const deletedQuizSet = await this.quizSetModel.findByIdAndDelete(id).exec();
    if (!deletedQuizSet) {
      throw new NotFoundException(`QuizSet with ID ${id} not found`);
    }
    return deletedQuizSet;
  }
}
