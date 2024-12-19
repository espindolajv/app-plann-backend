import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  membersEmail: string[];
}

export class UpdateWorkspace {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  color?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
