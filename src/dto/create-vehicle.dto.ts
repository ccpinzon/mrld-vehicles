import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsOptional()
  service?: string;
}
