export interface FilterProps {
  page: number
}


export interface Thumbnail {
  root_class: string
  image: string
  thumbnail_url: string
}

export interface ImageExif {
  make: string
  model: string
  shutterspeed: string
  fstop: string
  iso: string
  focallength: string
  lens: string
}

export interface ImageStat {
  views: number
  likes: number
  downloads: number
  comments: number
}

export interface ImageGps {
  latitude: string
  longtitude: string
}

export interface ImageSize {
  width: number;
  height: number;
  url: string;
}


export interface ImageThumbsResponse {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  thumbnails: Thumbnail[];
}

export interface ImageDetailsResponse {
  image: string;
  source: string
  image_url: string;
  exif: ImageExif;
  stat: ImageStat;
  tags: string[];
  license: string;
  uploaded: string;
  owner: string;
  title: string;
  gps: ImageGps;
  size: ImageSize[];
  root_class: string;
  sub_class: string;
  rating: null
  crawl_id: number;
  crawl_note: string;
  crawl_count: number
}

export interface ApiResponse<T> {
  code: number;
  title: string;
  message: string;
  data?: T;
}