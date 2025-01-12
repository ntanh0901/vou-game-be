import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionsService } from 'src/questions/questions.service';
import { Player, PlayerDocument } from './game-events.schema';

@Injectable()
export class GameEventsService {
  constructor(
    private readonly questionsService: QuestionsService,
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async getQuestionByIndex(index: number, event: string) {
    return this.questionsService.getQuestionsByIndex(index, event);
  }

  async validateAnswer(questionId: string, answerIndex: number) {
    const question = await this.questionsService.getQuestionById(questionId);
    return question.correctIndex === answerIndex;
  }

  async createPlayer(player: Player): Promise<Player> {
    const existingPlayer = await this.playerModel
      .findOne({ clientId: player.clientId })
      .exec();
    if (existingPlayer) {
      return existingPlayer;
    }
    const newPlayer = new this.playerModel(player);
    return newPlayer.save();
  }

  async updatePlayerPoints(clientId: string, points: number): Promise<Player> {
    return this.playerModel.findOneAndUpdate(
      { clientId },
      { $inc: { points } },
      { new: true },
    );
  }

  async removePlayer(clientId: string): Promise<Player> {
    return this.playerModel.findOneAndDelete({ clientId });
  }

  async getLeaderboard(): Promise<Player[]> {
    return this.playerModel.find().sort({ points: -1 }).exec();
  }

  async clearPlayers() {
    return this.playerModel.deleteMany({});
  }
}
