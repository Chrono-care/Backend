export interface IAccountInfoFromRequest extends Request {
  account: {
    uuid: string;
    email: string;
  };
}
