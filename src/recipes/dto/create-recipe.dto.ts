import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRecipeDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsString()
  @IsNotEmpty()
  imageName: string;

  @IsString()
  @IsOptional() // Mark as optional
  cleanedIngredients: string;
}
