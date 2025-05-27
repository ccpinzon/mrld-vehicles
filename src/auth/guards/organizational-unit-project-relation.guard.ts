import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationalUnit } from '../../entities';

@Injectable()
export class OrganizationalUnitProjectRelationGuard implements CanActivate {
  constructor(
    @InjectRepository(OrganizationalUnit)
    private organizationalUnitRepository: Repository<OrganizationalUnit>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Obtener los IDs de proyecto y unidad organizativa
    const projectId =
      request.params.projectId ||
      request.query.projectId ||
      (request.body && request.body.projectId);

    const organizationalUnitId =
      request.params.organizationalUnitId ||
      request.query.organizationalUnitId ||
      (request.body && request.body.organizationalUnitId);

    // Si no se especifican ambos IDs, permitir el acceso
    if (!projectId || !organizationalUnitId) {
      return true;
    }

    // Verificar que la unidad organizativa pertenece al proyecto
    const organizationalUnit = await this.organizationalUnitRepository.findOne({
      where: {
        id: Number(organizationalUnitId),
        projectId: Number(projectId),
      },
    });

    if (!organizationalUnit) {
      throw new ForbiddenException(
        'La unidad organizativa no pertenece al proyecto especificado',
      );
    }

    return true;
  }
}
