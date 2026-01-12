import { Controller, Post, Get, Body, Param, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenResponseDto, ValidateTokenResponseDto } from './dto/token-response.dto';

@ApiTags('Access token')
@Controller('api')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Post('token')
    @ApiOperation({ summary: 'Création d\'un token de connection' })
    @ApiResponse({ status: 201, description: 'Création avec succès des tokens', type: TokenResponseDto })
    @ApiResponse({ status: 404, description: 'Identifiants non trouvé' })
    async createToken(
        @Body() dto: CreateTokenDto,
        @Ip() ip: string,
    ): Promise<TokenResponseDto> {
        return this.tokenService.createTokens(dto, ip);
    }

    @Get('validate/:accessToken')
    @ApiOperation({ summary: 'Confirme la validité d\'un access token' })
    @ApiResponse({ status: 200, description: 'Renvoie l\'access token', type: ValidateTokenResponseDto })
    @ApiResponse({ status: 404, description: 'Token non trouvé / invalide' })
    async validateToken(
        @Param('accessToken') accessToken: string,
    ): Promise<ValidateTokenResponseDto> {
        return this.tokenService.validateToken(accessToken);
    }
}
