import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSettingsDTO {
    @IsOptional()
    @ApiProperty()
    key: string;

    @IsOptional()
    @ApiProperty()
    value: any;

    @IsOptional()
    @ApiProperty()
    keys: Array<any>;
}
