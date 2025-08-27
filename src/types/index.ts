export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
  success?: boolean;
  statusCode?: number;
  timestamp?: string;
}
export const transformApiResponse = <T>(
  response: ApiResponse<T[]> | T[]
): T[] => {
  return Array.isArray(response) ? response : response.data;
};

export const transformApiResponseSingle = <T>(
  response: ApiResponse<T> | T[]
): T => {
  return Array.isArray(response) ? response[0] : response.data;
};
