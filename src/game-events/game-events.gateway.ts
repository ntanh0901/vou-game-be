import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameEventsService } from './game-events.service';

@WebSocketGateway(8002, {})
export class GameEventsGateway {
  @WebSocketServer()
  server: Server;

  private questionStartTime: number;
  private gameStarted: boolean = false;
  private currentQuestionIndex: number = 0;
  private currentQuestion: any;

  constructor(private readonly gameEventsService: GameEventsService) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    await this.gameEventsService.createPlayer({
      clientId: client.id,
      username: data.username,
      points: 0,
    });
    this.server.to(data.room).emit('joinedRoom', [data.username, client.id]);

    // If the game has started, send the current question and remaining time to the new player
    if (this.gameStarted) {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - this.questionStartTime) / 1000;
      const timeRemaining = Math.max(0, 30 - timeElapsed); // 30 seconds for each question
      client.emit('currentQuestion', {
        question: this.currentQuestion,
        timeRemaining,
      });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    await this.gameEventsService.removePlayer(client.id);
    this.server.to(data.room).emit('leftRoom', data.username);
  }

  @SubscribeMessage('startCountdown')
  handleStartCountdown(
    @MessageBody() data: { room: string; countdown: number },
    @ConnectedSocket() client: Socket,
  ) {
    let countdown = data.countdown;
    const interval = setInterval(() => {
      if (countdown > 0) {
        this.server.to(data.room).emit('countdown', countdown);
        countdown--;
      } else {
        clearInterval(interval);
        this.server.to(data.room).emit('gameStarted');
        this.gameStarted = true;
        this.startQuestionEmission(data.room);
      }
    }, 1000);
  }

  private async startQuestionEmission(room: string) {
    const questionInterval = setInterval(async () => {
      const question = await this.gameEventsService.getQuestionByIndex(
        this.currentQuestionIndex,
        room,
      );
      if (question.length > 0) {
        this.questionStartTime = Date.now(); // Store the start time of the question
        this.currentQuestion = question; // Store the current question
        this.server.to(room).emit('newQuestion', question);
        this.currentQuestionIndex++;
        await this.delay(30000); // Wait for 30 seconds for players to answer

        const leaderboard = await this.gameEventsService.getLeaderboard();
        this.server.to(room).emit('leaderboard', leaderboard);
        await this.delay(10000); // Display leaderboard for 10 seconds
      } else {
        clearInterval(questionInterval);
        const finalLeaderboard = await this.gameEventsService.getLeaderboard();
        this.server.to(room).emit('gameEnded', finalLeaderboard);
        await this.gameEventsService.clearPlayers();
        this.gameStarted = false; // Reset game state
        this.currentQuestionIndex = 0;
        this.currentQuestion = null;
      }
    }, 40000); // Total interval time (30s for question + 10s for leaderboard)
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody()
    data: { questionId: string; answerIndex: number; userId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const isCorrect = await this.gameEventsService.validateAnswer(
      data.questionId,
      data.answerIndex,
    );
    if (isCorrect) {
      const currentTime = Date.now();
      const timeTaken = (currentTime - this.questionStartTime) / 1000; // Time taken in seconds
      const points = this.calculatePoints(timeTaken);
      await this.gameEventsService.updatePlayerPoints(client.id, points); // Update points based on time taken
    }
    client.emit('answerResult', { isCorrect });
  }

  private calculatePoints(timeTaken: number): number {
    const maxPoints = 1000;
    const minPoints = 1;
    const maxTime = 30; // Maximum time to answer in seconds

    // Calculate points based on time taken
    const points = maxPoints - (timeTaken / maxTime) * (maxPoints - minPoints);
    return Math.max(minPoints, Math.round(points)); // Ensure points are at least minPoints
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
