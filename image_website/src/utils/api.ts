import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


import { 
    FilterProps, 
    ApiResponse,
    ImageThumbsResponse,
    ImageDetailsResponse,
    ImageMetaDataResponse,
    ImageTag
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
          page = 1,
          title = '',
          tag = '',
          exifMake='',
          exifModel='',
          orderBy = '',
          startDate = '',
          endDate = ''
        } = filters;
  
  
        return this.Request(
          'get', 
          `${this.baseURL}/api/images?title=${title}&tag=${tag}&exifMake=${exifMake}&exifMode=${exifModel}&orderBy=${orderBy}&startDate=${startDate}&endDate=${endDate}&page=${page}`
        );
    };

    public getImageDetails = async (imageName: string): Promise<ImageDetailsResponse> => 
    {
        return this.Request('get', `/api/images/${imageName}`);
    };

    public getImageTag = async (): Promise<ImageTag> => 
    {
        return this.Request('get', `/api/features/tag`);
    };

    public getExifMake = async (inputField: string): Promise<string[]> => 
    {
      return this.Request('get', `/api/features/exif/make?search=${inputField}`);
      
    };

    public getExifModel = async (inputField: string): Promise<string[]> => 
    {
      return this.Request('get', `/api/features/exif/model?search=${inputField}`);   
    };

  
}

export default new API();




