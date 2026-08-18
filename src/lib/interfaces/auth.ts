export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

  export interface ISignupPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface ILoginPayload {
    email: string;
    password: string;
  }
  
  /** POST /auth/forgot-password */
  export interface IForgotPasswordPayload {
    email: string;
  }
  
  export interface IUpdateProfilePayload {
    firstName: string;
    lastName: string;
  }
  
  export interface IVerifyEmailPayload {
    email: string;
    token: string;
  }