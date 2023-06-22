

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



export const updateSearchParams = (key: string, value: string) => {
    
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(key, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
}

