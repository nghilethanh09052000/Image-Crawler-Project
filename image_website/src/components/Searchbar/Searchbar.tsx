'use client'


import { useState, useEffect, ChangeEvent, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppContext, setLoading } from '@/context/Context';
import { updateSearchParams } from '@/utils/utils';

const SearchBar = () => {

  const router = useRouter()
  const searchParams = useSearchParams()
  const title = searchParams.get('title')

  const {dispatch} = useContext(AppContext)

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm('')
    setLoading(dispatch, false);
  }, [title]);



  const handleSumit = async () => {

    setLoading(dispatch, true)
    const newPathname = updateSearchParams("title", `${searchTerm}`);
    router.push(newPathname)
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    
    setSearchTerm(event.target.value);
  };
  

  return (
    <div className="relative w-full">
      <input
        type="search"
        id="search-dropdown"
        className="placeholder:text-indigo-300 subpixel-antialiased font-mono 
            block p-2.5 
            w-full z-20 
            text-sm 
            text-white-900 
            bg-white-50 
            rounded-lg
            border-l-white-50 
            dark:bg-white-700 
            dark:placeholder-white-400 dark:text-black
        "
        placeholder="Search for Images...."
        value={searchTerm}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="
            absolute 
            top-0 
            right-0 
            p-2.5 
            text-sm 
            font-medium 
            text-white 
            bg-indigo-700 
            rounded-r-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        onClick={handleSumit}
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </div>
  );
};

export default SearchBar;
