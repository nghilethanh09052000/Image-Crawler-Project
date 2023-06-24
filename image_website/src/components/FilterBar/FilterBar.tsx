"use client";

import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { AppContext,setLoading } from "@/context/Context";
import api from "@/utils/api";
import dayjs, { Dayjs } from "dayjs";
import { debounce } from "lodash";
import _ from 'lodash';
import { handleMultipleSearchParams } from "@/utils/utils";
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
  tag: string;
  orderBy: SortByOptions | '';
  exifMake: string;
  exifModel: string;
  startDate: string;
  endDate: string;
}

const sortByList: (SortByOptions | '')[] = [
  SortByOptions.Views,
  SortByOptions.Likes,
  SortByOptions.Downloads,
  SortByOptions.Comments,
];

const data: FilterData = {
  tag: '',
  orderBy: '',
  exifMake: '',
  exifModel: '',
  startDate: '',
  endDate: '',
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
    const fetchOptionData = async () => {
      try {
        
        const getTags = await api.getImageTag();
        const getExifMake = await api.getExifMake()
        const getExifModel = await api.getExifModel()

        const { tag } = getTags
        const {makeGroups} = getExifMake
        const {modelGroups} = getExifModel

        setTagOptions(tag);
        setMakeOption(makeGroups);
        setModelOption(modelGroups)

      } catch (err) {
        console.log('Failed To Fetch Tags');
      }
    };

    fetchOptionData();

  }, []);


  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleChangeAction = useCallback(
    (
      e: React.SyntheticEvent | null, 
      value: string | null | Dayjs, 
      name: string
    ) => {
      if (!value) return;
      setFilterData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const renderFilterTag = useMemo(() => {
    return (
      <Autocomplete
        value={filterData.tag}
        options={memoizedTagOptions}
        renderInput={(params) => <TextField {...params} label="Find By Tags" />}
        onChange={(e, value) => handleChangeAction(e, value, 'tag')}
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
  }, [filterData.tag, memoizedTagOptions]);

  const renderSortBy = useMemo(() => {
    return (
      <Autocomplete
        value={filterData.orderBy}
        options={sortByList}
        renderInput={(params) => <TextField {...params} label="Sort By" />}
        isOptionEqualToValue={(option, value) => value === '' || option === value}
        onChange={(e, value) => handleChangeAction(e, value, 'orderBy')}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }}
      />
    );
  }, [filterData.orderBy]);
  
  const renderExifMake = useCallback(() => {
    return (
      <Autocomplete
        value={filterData.exifMake}
        options={memoizedMakeOptions}
        renderInput={(params) => <TextField {...params} label="Camera Make" />}
        onChange={(e, value) => handleChangeAction(e, value, 'exifMake')}
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
  }, [filterData.exifMake, memoizedMakeOptions]);
  
  const renderExifModel = useCallback(() => {
    return (
      <Autocomplete
        value={filterData.exifModel}
        options={memoizedModelOptions}
        renderInput={(params) => <TextField {...params} label="Camera Model" />}
        onChange={(e, value) => handleChangeAction(e, value, 'exifModel')}
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
  }, [filterData.exifModel, memoizedModelOptions]);

  const renderStartEndDate = () => {
    return (
      <LocalizationProvider 
        dateAdapter={AdapterDayjs}
      >
        <div className="flex justify-center items-center">
          <p className="mx-3 truncate">Uploaded Date Range: </p>
          <DatePicker
            value={dayjs(filterData.startDate)}
            onChange={(value) => handleChangeAction(null, value, 'startDate')} 
            label="Start Date" 
            openTo="month"
            views={['year', 'month', 'day']}
            format="MM-DD-YYYY"
          />
          <p className="mx-3">to</p>
          <DatePicker
            value={dayjs(filterData.endDate)}
            onChange={(value) => handleChangeAction(null, value, 'endDate')} 
            label="End Date" 
            disabled={!dayjs(filterData.startDate)}
            views={['year', 'month', 'day']}
            format="MM-DD-YYYY"
          />
        </div>
    </LocalizationProvider>
    )
  };

  const handleClearFilter = () => {
    setFilterData(data)
  }

  const handleValidateSubmit = (data: FilterData) => {
    let formattedStartDate: string = '';
    let formattedEndDate: string = '';
  
    const { startDate, endDate } = data;
  
    if (_.isObject(startDate)) {
      const startDateData = new Date(startDate);
      formattedStartDate = startDateData.toISOString().substring(0, 10);
    }
  
    if (_.isObject(endDate)) {
      const endDateDate = new Date(endDate);
      formattedEndDate = endDateDate.toISOString().substring(0, 10);
    }
  
    return {
      ...data,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  };
  

  const handleSumitFilters = () => {

      if (!filterData) return;

      const data = handleValidateSubmit(filterData)

      setLoading(dispatch, true);

      const newPathname = handleMultipleSearchParams(data);

      router.push(newPathname);
  }
  

  return (
    <>
      <div className="w-full flex justify-end mb-3">
        <div className="w-full max-w-md rounded-2xl bg-white p-2 flex justify-end">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="flex justify-end rounded-none bg-indigo-700 px-4 py-2 text-left text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
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
            <div className="grid lg:grid-cols-2 gap-6">

              <button 
                className="rounded-none border border-indigo-500 text-white bg-black lg:w-auto"
                onClick={handleSumitFilters}
                >
                  Apply
                </button>

              <button 
                className="rounded-none border border-indigo-500 text-black bg-white lg:w-auto"
                onClick={handleClearFilter}
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
