import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener el projectId de los parámetros de la solicitud o del cuerpo
    const projectId =
      request.params.projectId ||
      request.query.projectId ||
      (request.body && request.body.projectId);

    // Si no se especifica un projectId, permitir el acceso
    if (!projectId) {
      return true;
    }

    // Verificar si el usuario tiene acceso al proyecto
    const hasProjectAccess =
      user.projects &&
      Array.isArray(user.projects) &&
      user.projects.some((project) => project.id === Number(projectId));

    if (!hasProjectAccess) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }

    return true;
  }
}
