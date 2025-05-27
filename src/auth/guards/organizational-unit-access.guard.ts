import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OrganizationalUnitAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener el organizationalUnitId de los parámetros de la solicitud o del cuerpo
    const organizationalUnitId =
      request.params.organizationalUnitId ||
      request.query.organizationalUnitId ||
      (request.body && request.body.organizationalUnitId);

    // Si no se especifica un organizationalUnitId, permitir el acceso
    if (!organizationalUnitId) {
      return true;
    }

    // Verificar si el usuario tiene acceso a la unidad organizativa
    const hasOrgUnitAccess =
      user.organizationalUnits &&
      Array.isArray(user.organizationalUnits) &&
      user.organizationalUnits.some(
        (ou) => ou.id === Number(organizationalUnitId),
      );

    if (!hasOrgUnitAccess) {
      throw new ForbiddenException(
        'No tienes acceso a esta unidad organizativa',
      );
    }

    return true;
  }
}
