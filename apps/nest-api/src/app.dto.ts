import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from "class-validator";

export class ProtoDTO {
    @ApiProperty({example: "__proto__: abc"}) @IsNotEmpty() @IsString() name: string;
    @ApiProperty({example: "constructor: prototype"}) @IsNotEmpty() @IsString() password: string;
}

export class HtmlDTO {
    @ApiProperty({example: "<script>alert(1)</script><br><div>Hello world</div>"}) @IsNotEmpty() @IsString() textForm: string;
}

export class ExampleObject {
    property1: string;
    property2: string;
}

export class TestDTO {
    @ApiProperty({example: "THIS IS EXAMPLE PROPERTY"}) @IsNotEmpty() @IsString() name: string;
    @ApiProperty() @IsOptional() @IsNumber() bio?: number;
    @ApiProperty() @IsOptional() @IsObject() exampleObject?: ExampleObject;
}