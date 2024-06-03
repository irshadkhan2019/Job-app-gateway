import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class SignUp {
  public async create(req: Request, res: Response): Promise<void> {
    console.log("calling authService.signUp")
    const response: AxiosResponse = await authService.signUp(req.body);
    // response has  user: result, token: userJWT  set by auth service User create  method
    // add user token as session 
    req.session = { jwt: response.data.token };
    console.log(response.data)
    res.status(StatusCodes.CREATED).json({ message: response.data.message, user: response.data.user });
  }
}