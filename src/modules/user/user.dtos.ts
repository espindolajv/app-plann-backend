import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, {
    message:
      'Name can only contain letters and single spaces between words, no special characters or numbers.',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  @IsString()
  @IsNotEmpty()
  password: string;
}

// export type UserValidateDto = Omit<User, 'password'>;

export interface UserValidateDto {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, {
    message:
      'Name can only contain letters and single spaces between words, no special characters or numbers.',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
