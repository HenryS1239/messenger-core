import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserCreateDTO {
    @IsNotEmpty()
    @ApiProperty()
    type: string;

    @IsNotEmpty()
    @ApiProperty()
    role: string;

    @IsOptional()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsOptional()
    @ApiProperty()
    password: string;

    @IsOptional()
    @ApiProperty()
    company: string;

    @IsNotEmpty()
    @ApiProperty()
    platforms: string[];

    @IsOptional()
    @ApiProperty()
    photo: string[];

    @IsOptional()
    @ApiProperty()
    contact: string;

    @IsOptional()
    @ApiProperty()
    email: string;

    @IsOptional()
    @ApiProperty()
    profession: string;

    @IsOptional()
    @ApiProperty()
    department: string;

    @IsOptional()
    @ApiProperty()
    vendorType: string;

    @IsOptional()
    @ApiProperty()
    customerType: string;

    @IsOptional()
    @ApiProperty()
    isDisabled: boolean;
}
export class UserUpdateDTO {
    @IsNotEmpty()
    @ApiProperty()
    type: string;

    @IsNotEmpty()
    @ApiProperty()
    role: string;

    @IsOptional()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsOptional()
    @ApiProperty()
    company: string;

    @IsNotEmpty()
    @ApiProperty()
    platforms: string[];

    @IsOptional()
    @ApiProperty()
    photo: string[];

    @IsOptional()
    @ApiProperty()
    contact: string;

    @IsOptional()
    @ApiProperty()
    email: string;

    @IsOptional()
    @ApiProperty()
    profession: string;

    @IsOptional()
    @ApiProperty()
    department: string;

    @IsOptional()
    @ApiProperty()
    vendorType: string;

    @IsOptional()
    @ApiProperty()
    customerType: string;

    @IsOptional()
    @ApiProperty()
    isDisabled: boolean;

    @IsOptional()
    @ApiProperty()
    password: string;
}

export class UserStatusDTO {
    @IsNotEmpty()
    @ApiProperty()
    isDisabled: boolean;
}
