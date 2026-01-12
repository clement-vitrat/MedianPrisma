import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
    @ApiProperty({ example: 'john.doe', description: 'Login de l\'utilisateur' })
    login: string;

    @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur' })
    password: string;

    @ApiProperty({ example: 'web', description: 'Origine de la connexion', required: false })
    from?: string;
}
