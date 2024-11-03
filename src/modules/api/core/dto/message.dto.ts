import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDTO {
    @IsNotEmpty()
    @ApiProperty()
    subject: string;

    @IsOptional()
    @ApiProperty()
    content?: string;

    @IsOptional()
    @ApiProperty()
    receipient: string[];

    @IsOptional()
    @ApiProperty()
    selectAll: boolean;
}
