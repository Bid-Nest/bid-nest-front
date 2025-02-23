import { ICSRFTokenRequest } from 'interfaces/requests/CSRFTokenRequest';

export class CSRFTokenService {
  public generateCsrfToken(req: ICSRFTokenRequest): string {
    return req.csrfToken();
  }
}
