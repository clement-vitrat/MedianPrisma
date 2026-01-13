import { ApiProperty } from '@nestjs/swagger';

export class TokenEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpiresAt: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshTokenExpiresAt: string;
}
