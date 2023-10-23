import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
