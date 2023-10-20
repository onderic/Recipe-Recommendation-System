import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'recipies' }) // Set the table name explicitly
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column({ name: 'Title', nullable: true })
  title: string;

  @Column({ name: 'Ingredients', nullable: true })
  ingredients: string;

  @Column({ name: 'Instructions', nullable: true })
  instructions: string;

  @Column({ name: 'Image_Name', nullable: true })
  imageName: string;

  @Column({ name: 'Cleaned_Ingredients', nullable: true }) // Mark as optional
  cleanedIngredients: string;
}
