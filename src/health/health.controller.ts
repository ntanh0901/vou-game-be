import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { HealthService } from './health.service';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ResponseMessage('Health check successful')
  @Get()
  getHealth(): string {
    return this.healthService.getHealth();
  }
}
