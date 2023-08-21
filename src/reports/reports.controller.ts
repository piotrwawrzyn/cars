import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report-dto';
import { AdminOnly } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate-report-dto';

@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @Serialize(ReportDto)
  createReport(@Body() report: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(report, user);
  }

  @AdminOnly()
  @Patch('/:reportId/approve')
  changeApproval(
    @Param('reportId') reportId: string,
    @Body() body: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(Number(reportId), body.approved);
  }

  @Get()
  getEstimatedPrice(@Query() query: GetEstimateDto) {
    return this.reportsService.getEstimatedPrice(query);
  }
}
