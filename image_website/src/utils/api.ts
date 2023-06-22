import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


import { 
    FilterProps, 
    ApiResponse,
    ImageThumbsResponse,
    ImageDetailsResponse
} from "@/types";




class API {

    private baseURL: string 

    constructor()
    {
        this.baseURL = process.env.API_URL as string;
      
        axios.interceptors.response.use(
          (response: AxiosResponse<ApiResponse<any>>) => this.PostProcessing(response),
          (error: any) => this.HandleError(error)
        );
    }

    private PostProcessing = <T>(res: AxiosResponse<ApiResponse<T>>): T | Promise<never> | undefined => 
        {
        if (res.status < 200 || res.status >= 300) 
        {
          return Promise.reject({
            code: res.status || -1,
            title: res.statusText || 'Warning !',
            message: `invalid status ${res.status}`
          });
        }
    
        if (res.data) 
        {
            return res.data as T;
        }
 
    }

    private HandleError = (payload: any): Promise<never> => 
    {
        const response = payload.response || {};
        return Promise.reject({
          code: response.status || -3,
          title: response.statusText || 'Warning !',
          message: (response.data && response.data.error) || payload.message || 'unknown reason'
        });
    };

    private Request = <T>(method: string,url: string, responseType: 'json' = 'json'): Promise<T> => 
    {
        const config: AxiosRequestConfig = {
          method,
          url,
          responseType
        };
        return axios(config);
    };

    public getImageThumbs = async (filters: FilterProps): Promise<ImageThumbsResponse> => 
    {
        const { 
            page 
        } = filters;
        return this.Request('get', `${this.baseURL}/api/images?page=${page}`);
    };

    public getImageDetails = async (imageName: string): Promise<ImageDetailsResponse> => 
    {
        return this.Request('get', `/api/images/${imageName}`);
    };

    public getMetadata = async (filters: FilterProps): Promise<ImageDetailsResponse> => 
    {
      const { 
        page,
        title,
        tag,
        orderBy,
        startDate,
        endDate
      } = filters;

        return this.Request(
          'get', 
          `/api/metadata?title=${title}&tag=${tag}&page=${page}&orderBy=${orderBy}&startDate=${startDate}&endDate=${endDate}`
        );
    };

}

export default new API();




