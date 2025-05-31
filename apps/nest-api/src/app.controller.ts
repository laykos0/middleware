import {Body, Controller, Get, Post} from '@nestjs/common';
import {HtmlDTO, ProtoDTO, TestDTO} from "src/app.dto";
import {AppService} from './app.service';


@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('/sql_inject')
    postHello(@Body() body: TestDTO): void {
    }

    @Post('/proto')
    postProto(@Body() body: ProtoDTO): void {

    }

    @Post('/html')
    postHtml(@Body() body: HtmlDTO): void {
    }

}
