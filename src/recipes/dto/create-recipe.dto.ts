import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRecipeDto {
  recipe_id: number;

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
