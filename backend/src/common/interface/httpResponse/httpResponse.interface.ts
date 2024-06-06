export interface IhttpResponse {
  message: string;
  success: boolean;
  error?: string;
  statusCode?: number;
  data?: any;
}
