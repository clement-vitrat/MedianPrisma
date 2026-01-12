import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
    @ApiProperty({ description: 'Token d\'authentification (valable 1h)' })
    accessToken: string;

    @ApiProperty({ description: 'Date de fin de validité de l\'access token' })
    accessTokenExpiresAt: Date;

    @ApiProperty({ description: 'Token permettant la génération d\'un nouvel access token' })
    refreshToken: string;

    @ApiProperty({ description: 'Fin de validité du refresh token' })
    refreshTokenExpiresAt: Date;
}

export class ValidateTokenResponseDto {
    @ApiProperty({ description: 'L\'access token' })
    accessToken: string;

    @ApiProperty({ description: 'Date d\'expiration de l\'access token' })
    accessTokenExpiresAt: Date;
}
