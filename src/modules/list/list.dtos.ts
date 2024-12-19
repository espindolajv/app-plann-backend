import { IsString, IsOptional, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsOptional()
  workspaceId?: string;
}

export class UpdateListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export interface ListType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  userId: string;
  workspaceId: string | null;
}
