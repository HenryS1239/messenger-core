import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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

export class RegisterFCMTokenDTO {
    @IsNotEmpty()
    @ApiProperty()
    fcmToken: string;

    @IsNotEmpty()
    @ApiProperty()
    isNotification: boolean;
}
