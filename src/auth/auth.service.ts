import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenRequest } from './dto/create-token.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createToken(createTokenRequest: CreateTokenRequest) {
    // Vérifier les credentials
    const user = await this.prisma.user.findUnique({
      where: { login: createTokenRequest.login },
    });

    if (!user || user.password !== createTokenRequest.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Générer les tokens (exemple simplifié)
    const accessToken = Buffer.from(
      JSON.stringify({ sub: user.id, login: user.login })
    ).toString('base64');
    const refreshToken = Buffer.from(
      JSON.stringify({ sub: user.id, type: 'refresh' })
    ).toString('base64');

    const now = new Date();
    const accessTokenExpiry = new Date(now.getTime() + 60 * 60 * 1000); // 60 minutes
    const refreshTokenExpiry = new Date(now.getTime() + 120 * 60 * 1000); // 120 minutes

    return {
      accessToken,
      accessTokenExpiresAt: accessTokenExpiry.toISOString(),
      refreshToken,
      refreshTokenExpiresAt: refreshTokenExpiry.toISOString(),
      user: {
        id: user.id,
        login: user.login,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    // Vérifier et décoder le refresh token
    try {
      const decoded = JSON.parse(Buffer.from(refreshToken, 'base64').toString());

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Générer un nouveau access token
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const accessToken = Buffer.from(
        JSON.stringify({ sub: user.id, login: user.login })
      ).toString('base64');

      const now = new Date();
      const accessTokenExpiry = new Date(now.getTime() + 60 * 60 * 1000);
      const newRefreshToken = Buffer.from(
        JSON.stringify({ sub: user.id, type: 'refresh' })
      ).toString('base64');
      const refreshTokenExpiry = new Date(now.getTime() + 120 * 60 * 1000);

      return {
        accessToken,
        accessTokenExpiresAt: accessTokenExpiry.toISOString(),
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt: refreshTokenExpiry.toISOString(),
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async validateToken(accessToken: string) {
    try {
      const decoded = JSON.parse(Buffer.from(accessToken, 'base64').toString());

      // Vérifier que le token n'est pas un refresh token
      if (decoded.type === 'refresh') {
        throw new Error('Invalid token type');
      }

      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Retourner le token et sa date d'expiration
      // Dans une implémentation réelle, vous voudriez vérifier l'expiration
      const now = new Date();
      const accessTokenExpiresAt = new Date(now.getTime() + 60 * 60 * 1000);

      return {
        accessToken,
        accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
      };
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }
}