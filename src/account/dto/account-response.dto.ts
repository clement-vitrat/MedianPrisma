import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
    @ApiProperty()
    uid: string;

    @ApiProperty()
    login: string;

    @ApiProperty({ type: [String] })
    roles: string[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
