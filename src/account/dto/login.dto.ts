import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'john.doe' })
    login: string;

    @ApiProperty({ example: 'password123' })
    password: string;
}
