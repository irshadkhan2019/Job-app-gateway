import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Search {
  public async gigById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getGig(req.params.gigId);
    res.status(StatusCodes.OK).json({ message: response.data.message, gig: response.data.gig });
  }

  public async gigs(req: Request, res: Response): Promise<void> {
    const { from, size, type } = req.params;
    let query = '';
    console.log('Query before',req.query)//  Query before { query: 'beauty' }

    const objList = Object.entries(req.query); //req.query gives obj but we dont need obj 
    const lastItemIndex = objList.length - 1;
    // construct query
    // //eg. /auth/search/gig/0/10/forward?query=programming&delivery_time=3&minPrice=5&maxPrice=20
    objList.forEach(([key, value], index) => {
      query += `${key}=${value}${index !== lastItemIndex ? '&' : ''}`; //add & if not last item eg.delivery_time=3&minPrice=5&maxPrice=20
    });
    // eg query =query=programming&delivery_time=3&minPrice=5&maxPrice=20
    console.log('Query after',query)//Query after query=beauty
  

    const response: AxiosResponse = await authService.getGigs(`${query}`, from, size, type);
    res.status(StatusCodes.OK).json({ message: response.data.message, total: response.data.total, gigs: response.data.gigs });
  }
}