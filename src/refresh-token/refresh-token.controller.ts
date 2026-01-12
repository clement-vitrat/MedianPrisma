import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenService } from '../token/token.service';
import { TokenResponseDto } from '../token/dto/token-response.dto';

@ApiTags('Refresh token')
@Controller('api/refresh-token')
export class RefreshTokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Post(':refreshToken/token')
    @ApiOperation({ summary: 'Création d\'un access token à partir d\'un refresh token' })
    @ApiResponse({ status: 201, description: 'Création avec succès des nouveaux tokens', type: TokenResponseDto })
    @ApiResponse({ status: 404, description: 'Token invalide ou inexistant' })
    async refreshToken(
        @Param('refreshToken') refreshToken: string,
    ): Promise<TokenResponseDto> {
        return this.tokenService.refreshTokens(refreshToken);
    }
}
