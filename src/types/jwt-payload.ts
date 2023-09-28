import { ObjectId } from 'mongodb';

export class JwtPayload {
  _id: ObjectId;
  email: string;
  username: string;
  role: string;
}
