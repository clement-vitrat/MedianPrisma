import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
    private readonly ACCESS_TOKEN_EXPIRY_MINUTES = 60;
    private readonly REFRESH_TOKEN_EXPIRY_MINUTES = 120;
    private readonly MAX_ATTEMPTS = 3;
    private readonly ATTEMPT_WINDOW_MINUTES = 5;
    private readonly BLOCK_DURATION_MINUTES = 30;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async createTokens(dto: CreateTokenDto, ip: string) {
        // Check rate limiting
        await this.checkRateLimiting(ip);

        // Find user
        const user = await this.prisma.user.findUnique({
            where: { login: dto.login },
        });

        if (!user) {
            await this.recordLoginAttempt(ip, false);
            throw new NotFoundException('Identifiants non trouvé (paire login / mot de passe inconnue)');
        }

        // Check account status
        if (user.status === 'closed') {
            throw new ForbiddenException('Account is closed');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            await this.recordLoginAttempt(ip, false);
            throw new NotFoundException('Identifiants non trouvé (paire login / mot de passe inconnue)');
        }

        // Record successful attempt
        await this.recordLoginAttempt(ip, true);

        // Generate tokens
        return this.generateTokens(user);
    }

    async validateToken(accessToken: string) {
        try {
            const payload = this.jwtService.verify(accessToken);
            const expiresAt = new Date(payload.exp * 1000);

            return {
                accessToken,
                accessTokenExpiresAt: expiresAt,
            };
        } catch {
            throw new NotFoundException('Token non trouvé / invalide');
        }
    }

    async refreshTokens(refreshToken: string) {
        // Find refresh token
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            throw new NotFoundException('Token invalide ou inexistant');
        }

        // Check if expired
        if (new Date() > storedToken.expiresAt) {
            await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
            throw new NotFoundException('Token invalide ou inexistant');
        }

        // Delete old refresh token
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

        // Generate new tokens
        return this.generateTokens(storedToken.user);
    }

    private async generateTokens(user: { uid: string; login: string; roles: string[] }) {
        const now = new Date();
        const accessTokenExpiresAt = new Date(now.getTime() + this.ACCESS_TOKEN_EXPIRY_MINUTES * 60 * 1000);
        const refreshTokenExpiresAt = new Date(now.getTime() + this.REFRESH_TOKEN_EXPIRY_MINUTES * 60 * 1000);

        // Generate access token
        const payload = { sub: user.uid, login: user.login, roles: user.roles };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: `${this.ACCESS_TOKEN_EXPIRY_MINUTES}m`,
        });

        // Generate refresh token
        const refreshTokenValue = uuidv4();
        await this.prisma.refreshToken.create({
            data: {
                token: refreshTokenValue,
                userId: user.uid,
                expiresAt: refreshTokenExpiresAt,
            },
        });

        return {
            accessToken,
            accessTokenExpiresAt,
            refreshToken: refreshTokenValue,
            refreshTokenExpiresAt,
        };
    }

    private async checkRateLimiting(ip: string) {
        const windowStart = new Date(Date.now() - this.ATTEMPT_WINDOW_MINUTES * 60 * 1000);

        // Count failed attempts in the window
        const failedAttempts = await this.prisma.loginAttempt.count({
            where: {
                ip,
                success: false,
                createdAt: { gte: windowStart },
            },
        });

        if (failedAttempts >= this.MAX_ATTEMPTS) {
            // Check if still blocked
            const lastAttempt = await this.prisma.loginAttempt.findFirst({
                where: { ip, success: false },
                orderBy: { createdAt: 'desc' },
            });

            if (lastAttempt) {
                const blockEnd = new Date(lastAttempt.createdAt.getTime() + this.BLOCK_DURATION_MINUTES * 60 * 1000);
                if (new Date() < blockEnd) {
                    throw new ForbiddenException(
                        `Trop de tentatives. Réessayez dans ${Math.ceil((blockEnd.getTime() - Date.now()) / 60000)} minutes.`
                    );
                }
            }
        }
    }

    private async recordLoginAttempt(ip: string, success: boolean) {
        await this.prisma.loginAttempt.create({
            data: { ip, success },
        });
    }
}
