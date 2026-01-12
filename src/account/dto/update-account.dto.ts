import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
    @ApiProperty({ example: 'john.doe', required: false })
    login?: string;

    @ApiProperty({ example: 'newpassword123', required: false })
    password?: string;

    @ApiProperty({ type: [String], required: false })
    roles?: string[];

    @ApiProperty({ example: 'open', required: false })
    status?: string;
}
