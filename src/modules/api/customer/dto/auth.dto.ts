import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProfileAppDTO {
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsOptional()
    @ApiProperty()
    email: string;

    @IsOptional()
    @ApiProperty()
    contact: string;

    @IsOptional()
    @ApiProperty()
    current: string;

    @IsOptional()
    @ApiProperty()
    password: string;

    @IsOptional()
    @ApiProperty()
    registrationTokens: string;
}
