import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import { AppService } from './app.service';


export class TestDTO {
  @ApiProperty({example: "THIS IS EXAMPLE PROPERTY"}) @IsNotEmpty() @IsString() name: string;
  @ApiProperty() @IsOptional() @IsString() bio?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/sql_inject')
  postHello(@Body() body: TestDTO): void {
    console.log(body)
  }
}
