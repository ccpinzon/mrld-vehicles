import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;

  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsNumber()
  @IsNotEmpty()
  transmitterId: number;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsNumber()
  @IsNotEmpty()
  organizationalUnitId: number;
}
