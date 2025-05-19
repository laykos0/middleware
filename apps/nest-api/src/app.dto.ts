import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class ProtoDTO {
    @ApiProperty({example: "__proto__: abc"}) @IsNotEmpty() @IsString() name: string;
}

export class TestDTO {
    @ApiProperty({example: "THIS IS EXAMPLE PROPERTY"}) @IsNotEmpty() @IsString() name: string;
    @ApiProperty() @IsOptional() @IsString() bio?: string;
}