"use client";

import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { AppContext,setLoading } from "@/context/Context";
import api from "@/utils/api";
import { debounce } from "lodash";
import { updateSearchParams } from "@/utils/utils";
import { Autocomplete, TextField } from "@mui/material";



import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';




enum SortByOptions {
  Views = 'Views',
  Likes = 'Likes',
  Downloads = 'Downloads',
  Comments = 'Comments',
}

interface FilterData {
  tagData: string;
  sortByData: SortByOptions | '';
  makeData: string;
  modelData: string;
  startDateData: string;
  endDateData: string;
}

const sortByList: (SortByOptions | '')[] = [
  SortByOptions.Views,
  SortByOptions.Likes,
  SortByOptions.Downloads,
  SortByOptions.Comments,
];

const data: FilterData = {
  tagData: '',
  sortByData: '',
  makeData: '',
  modelData: '',
  startDateData: '',
  endDateData: '',
};



const FilterBar = () => {

  const router = useRouter()
  const search = useSearchParams()
  const {dispatch} = useContext(AppContext)
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  // For Array Option of Autocomplete
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [makeOptions, setMakeOption] = useState<string[]>([])
  const [modelOptions, setModelOption] = useState<string[]>([])

   // Memoized options arrays for Autocomplete components
   const memoizedTagOptions = useMemo(() => tagOptions, [tagOptions]);
   const memoizedMakeOptions = useMemo(() => makeOptions, [makeOptions]);
   const memoizedModelOptions = useMemo(() => modelOptions, [modelOptions]);


  // For each data variables:
  const [filterData, setFilterData] = useState(data)

  useEffect(() => {
    setLoading(dispatch, false);
  }, [search]);


  useEffect(() => {
    const fetchTags = async () => {

      try {
        
        const getTags = await api.getImageTag();
        const { tag } = getTags
        setTagOptions(tag);
      } catch (err) {
        console.log('Failed To Fetch Tags');
      }
    };

    fetchTags();
  }, []);


  const handleSumitFilters = useCallback(
    (e: React.SyntheticEvent, value: string | null) => {
      if (!value) return;
      setLoading(dispatch, true);
      const newPathname = updateSearchParams('tag', `${value}`);
      router.push(newPathname);
    },
    [dispatch, router]
  );

  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleChangeAction = useCallback(
    (e: React.SyntheticEvent, value: string | null, name: string) => {
      if (!value) return;
      setFilterData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const handleMakeInputChange = useCallback(
    debounce(async (inputValue: string) =>{
      try 
      {
        const exifMakeData = await api.getExifMake(inputValue)

        const {
          makeGroups
        } = exifMakeData

        setMakeOption(makeGroups)
      }
      catch(err)
      {
        console.log("Error failed to fetch make option", err)
      }
    }, 300),
    []
  )

  const handleModelInputChange = useCallback(
    debounce(async (inputValue: string) =>{
      try 
      {
        const exifModelData = await api.getExifModel(inputValue)

        const {
          modelGroups
        } = exifModelData

        setModelOption(modelGroups)
      }
      catch(err)
      {
        console.log("Error failed to fetch make option", err)
      }
    }, 300),
    []
  )

  const renderFilterTag = useMemo(() => {
    return (
      <Autocomplete
        value={filterData.tagData}
        options={memoizedTagOptions}
        renderInput={(params) => <TextField {...params} label="Find By Tags" />}
        onChange={(e, value) => handleChangeAction(e, value, 'tagData')}
        isOptionEqualToValue={(option, value) => value === '' || option === value}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }}
      />
    );
  }, [filterData.tagData, memoizedTagOptions]);

  const renderSortBy = useMemo(() => {
    return (
      <Autocomplete
        value={filterData.sortByData}
        options={sortByList}
        renderInput={(params) => <TextField {...params} label="Sort By" />}
        isOptionEqualToValue={(option, value) => value === '' || option === value}
        onChange={(e, value) => handleChangeAction(e, value, 'sortByData')}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }}
      />
    );
  }, [filterData.sortByData]);
  
  const renderExifMake = useCallback(() => {
    return (
      <Autocomplete
        value={filterData.makeData}
        options={memoizedMakeOptions}
        renderInput={(params) => <TextField {...params} label="Camera Make" />}
        onChange={(e, value) => handleChangeAction(e, value, 'makeData')}
        onInputChange={(e, value) => handleMakeInputChange(value)}
        isOptionEqualToValue={(option, value) => value === '' || option === value}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }}
      />
    );
  }, [filterData.makeData, memoizedMakeOptions]);
  
  const renderExifModel = useCallback(() => {
    return (
      <Autocomplete
        value={filterData.modelData}
        options={memoizedModelOptions}
        renderInput={(params) => <TextField {...params} label="Camera Model" />}
        onChange={(e, value) => handleChangeAction(e, value, 'modelData')}
        onInputChange={(e, value) => handleModelInputChange(value)}
        isOptionEqualToValue={(option, value) => value === '' || option === value}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }}
      />
    );
  }, [filterData.modelData, memoizedModelOptions]);

  const renderStartEndDate = () => {
    return (
      <LocalizationProvider 
        dateAdapter={AdapterDayjs}
      >
        <div className="flex justify-center items-center">
          <DatePicker 
            label="Start Date" 
          />
          <p className="mx-3">to</p>
          <DatePicker 
            label="End Date" 
          />
        </div>
    </LocalizationProvider>
    )
  };
  
  console.log('Nghi', filterData)

  return (
    <>
      <div className="w-full flex justify-end mb-3">
        <div className="w-full max-w-md rounded-2xl bg-white p-2 flex justify-end">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="flex justify-end rounded-lg bg-indigo-700 px-4 py-2 text-left text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                  onClick={handleOpenFilter}
                >
                  <span>Show More Filter</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-white`}
                  />
                </Disclosure.Button>
              </>
            )}
          </Disclosure>
        </div>
      </div>
      {
      openFilter
      && 
      (
        <div className="grid grid-rows-4 gap-4 mb-12">
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6">
              {renderFilterTag}
              {renderSortBy}
          </div>
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6 ">
            {renderExifMake()}
            {renderExifModel()}
          </div>

          <div className="grid grid-rows-1">
            {renderStartEndDate()}
          </div>

          <div className="grid grid-rows-1">
            <div className="grid grid-cols-2 gap-6">

              <button 
                className="rounded-none border border-indigo-500 text-white bg-black"
                >
                  Apply
                </button>

              <button 
                className="rounded-none border border-indigo-500 text-black bg-white"
              >
                Clear Filter
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;
