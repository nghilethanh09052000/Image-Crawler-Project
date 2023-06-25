import { FilterProps } from "@/types";

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const updateSearchParams = (key: string, value: string) => {
    
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(key, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
}

export const handleMultipleSearchParams = (filters: FilterProps) => {

  const isFilterDataEmpty = Object.values(filters).every((value) => value === "");
  if(isFilterDataEmpty) return '/'

  const searchParams = new URLSearchParams(window.location.search);


  if (filters.tag) {
    searchParams.set('tag', filters.tag);
  }
  if (filters.orderBy) {
    searchParams.set('orderBy', filters.orderBy);
  }
  if (filters.exifMake) {
    searchParams.set('exifMake', filters.exifMake);
  }
  if (filters.exifModel) {
    searchParams.set('exifModel', filters.exifModel);
  }
  if (filters.startDate) {
    searchParams.set('startDate', filters.startDate);
  }
  if (filters.endDate) {
    searchParams.set('endDate', filters.endDate);
  }

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};


