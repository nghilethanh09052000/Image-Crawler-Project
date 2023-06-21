
import axios from "axios";
import { 
  FilterProps, 
  ApiResponse 
} from "@/types";




export const updateSearchParams = (key: string, value: string) => {
    
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(key, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;

}

export async function getImageThumbs(filters: FilterProps): Promise<ApiResponse> {
    const {page} = filters
    const res = await axios.get<ApiResponse>(`${process.env.API_URL}/api/images?page=${page}`);
    if (res.status !== 200) throw new Error("Error Connection");
    return res.data;
}

export async function getImageDetails(imageName:string): Promise<any> {

  
  
  const res = await axios.get<any>(`/api/images/${imageName}`);

  if (res.status !== 200) throw new Error("Error Connection");

  return res.data;
}