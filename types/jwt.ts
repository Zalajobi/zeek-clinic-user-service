// export interface JWTTokenVerificationSuccess {
//   data: {
//     id: string;
//     email: string;
//     role: string;
//   } | null;
//   exp: number;
//   iat: number;
// }

export interface JWTDataProps {
  id?: string;
  email?: string;
  role?: string;
  siteId?: string;
}
