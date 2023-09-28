import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Recipe extends Document {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop([{ name: String, quantity: String }]) // Example for ingredients array
  ingredients: { name: string; quantity: string }[];

  @Prop({ required: true, type: String })
  instructions: string;

  @Prop({ type: String }) // Example for imageUrl
  imageUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
