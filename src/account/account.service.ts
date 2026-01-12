import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async createAccount(dto: CreateAccountDto, requestUser?: { userId: string; roles: string[] }) {
        // Vérifier si l'utilisateur est authentifié
        if (!requestUser) {
            throw new UnauthorizedException('Il est nécessaire d\'être authentifié');
        }

        // Vérifier si l'utilisateur a le rôle admin
        if (!requestUser.roles || !requestUser.roles.includes('ROLE_ADMIN')) {
            throw new ForbiddenException('Il est nécessaire de disposer d\'un compte admin pour créer un compte');
        }

        // Vérifier si le login existe déjà
        const existingUser = await this.prisma.user.findUnique({
            where: { login: dto.login },
        });

        if (existingUser) {
            throw new ConflictException('Login already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Ajouter ROLE_USER si ROLE_ADMIN est présent (héritage)
        let roles = dto.roles;
        if (roles.includes('ROLE_ADMIN') && !roles.includes('ROLE_USER')) {
            roles = [...roles, 'ROLE_USER'];
        }

        // Create user
        const user = await this.prisma.user.create({
            data: {
                login: dto.login,
                password: hashedPassword,
                roles: roles,
                status: dto.status || 'open',
            },
        });

        return {
            uid: user.uid,
            login: user.login,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async findByUidOrMe(uid: string, requestUser: { userId: string; roles: string[] }) {
        // Vérifier si l'utilisateur est authentifié
        if (!requestUser) {
            throw new UnauthorizedException('Il est nécessaire d\'être authentifié');
        }

        // Résoudre l'alias "me"
        const targetUid = uid === 'me' ? requestUser.userId : uid;

        // Vérifier les permissions
        const isOwner = targetUid === requestUser.userId;
        const isAdmin = requestUser.roles && requestUser.roles.includes('ROLE_ADMIN');

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('Il est nécessaire d\'être admin ou d\'être le propriétaire du compte');
        }

        const user = await this.prisma.user.findUnique({
            where: { uid: targetUid },
            select: {
                uid: true,
                login: true,
                roles: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('Aucun utilisateur trouvé avec l\'UID donné');
        }

        return user;
    }

    async updateAccount(
        uid: string,
        dto: UpdateAccountDto,
        requestUser: { userId: string; roles: string[] },
    ) {
        // Vérifier si l'utilisateur est authentifié
        if (!requestUser) {
            throw new UnauthorizedException('Il est nécessaire d\'être authentifié');
        }

        // Résoudre l'alias "me"
        const targetUid = uid === 'me' ? requestUser.userId : uid;

        // Vérifier les permissions
        const isOwner = targetUid === requestUser.userId;
        const isAdmin = requestUser.roles && requestUser.roles.includes('ROLE_ADMIN');

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('Il est nécessaire d\'être admin ou d\'être le propriétaire du compte');
        }

        // Seul un admin peut modifier les roles
        if (dto.roles && !isAdmin) {
            throw new ForbiddenException('Seul un admin peut modifier les rôles');
        }

        // Vérifier que l'utilisateur existe
        const existingUser = await this.prisma.user.findUnique({
            where: { uid: targetUid },
        });

        if (!existingUser) {
            throw new NotFoundException('Aucun utilisateur trouvé avec l\'UID donné');
        }

        // Préparer les données de mise à jour
        const updateData: any = {};

        if (dto.login) {
            // Vérifier si le nouveau login est disponible
            const loginExists = await this.prisma.user.findFirst({
                where: { login: dto.login, uid: { not: targetUid } },
            });
            if (loginExists) {
                throw new ConflictException('Login already exists');
            }
            updateData.login = dto.login;
        }

        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        if (dto.roles) {
            // Ajouter ROLE_USER si ROLE_ADMIN est présent (héritage)
            let roles = dto.roles;
            if (roles.includes('ROLE_ADMIN') && !roles.includes('ROLE_USER')) {
                roles = [...roles, 'ROLE_USER'];
            }
            updateData.roles = roles;
        }

        if (dto.status) {
            updateData.status = dto.status;
        }

        const user = await this.prisma.user.update({
            where: { uid: targetUid },
            data: updateData,
            select: {
                uid: true,
                login: true,
                roles: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }
}
