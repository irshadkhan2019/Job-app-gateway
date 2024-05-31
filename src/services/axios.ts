import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { config } from '@gateway/config';

export class AxiosService {
  public axios: ReturnType<typeof axios.create>; 
  //whatever is type of axios.create will be type for axios
  
//   baseUrl ->auth service,gig service ,....
// serviceName->names in token list(const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];)
  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.axiosCreateInstance(baseUrl, serviceName);
  }

  public axiosCreateInstance(baseUrl: string, serviceName?: string): ReturnType<typeof axios.create> {
    let requestGatewayToken = '';
    if (serviceName) {
      requestGatewayToken = sign({ id: serviceName }, `${config.GATEWAY_JWT_TOKEN}`);
    }
    const instance: ReturnType<typeof axios.create> = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewayToken: requestGatewayToken 
        // we are checking req.headers?.gatewaytoken in verifyGatewayRequest()
      },
      withCredentials: true
    });
    return instance;
  }
}

// const axiosTest=new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`,'auth');-> this auth will be checked by verifyGatewayRequest() and allow
//the request if its one of the name present in token list.here auth exists so allow