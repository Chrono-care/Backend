export interface IAccountInfoFromRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}
