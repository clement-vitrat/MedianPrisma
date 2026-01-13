import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateTokenRequest } from './dto/create-token.dto';
import { TokenEntity } from './entities/token.entity';
import { ValidateTokenResponse } from './entities/validate-token.entity';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiCreatedResponse({ type: TokenEntity })
  createToken(@Body() createTokenRequest: CreateTokenRequest) {
    return this.authService.createToken(createTokenRequest);
  }

  @Post('refresh-token/:refreshToken/token')
  @ApiCreatedResponse({ type: TokenEntity })
  refreshAccessToken(@Param('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Get('validate/:accessToken')
  @ApiOkResponse({ type: ValidateTokenResponse })
  validateToken(@Param('accessToken') accessToken: string) {
    return this.authService.validateToken(accessToken);
  }
}
