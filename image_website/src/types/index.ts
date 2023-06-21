export interface FilterProps {
    page: number
  }
  
export interface Thumbnail {
    root_class: string;
    image: string;
    thumbnail_url: string;
  }
  
export interface ApiResponse {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    thumbnails: Thumbnail[];
}