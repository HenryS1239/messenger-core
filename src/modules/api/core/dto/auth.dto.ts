import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}

export class UpdatePasswordDTO {
    @IsNotEmpty()
    @ApiProperty()
    current: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}

export class UpdateProfileDTO {
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
    photo: string;
}

export class ForgetPasswordDTO {
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}

export class ResetPasswordDTO {
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    token: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}
