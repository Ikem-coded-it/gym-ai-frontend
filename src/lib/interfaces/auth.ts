export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

  /** Form / service payload for POST /auth/signup */
  export interface ISignupPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  /** Response from POST /auth/signup (UserPrivate) */
  export interface ISignupResponse {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ILoginPayload {
    email: string;
    password: string;
  }

  /** Response from POST /auth/login */
  export interface ILoginResponse {
    access_token: string;
    token_type: string;
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