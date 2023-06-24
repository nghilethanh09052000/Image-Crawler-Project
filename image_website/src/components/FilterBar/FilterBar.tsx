"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { AppContext,setLoading } from "@/context/Context";
import api from "@/utils/api";
import { updateSearchParams } from "@/utils/utils";
import { 
  Autocomplete, 
  TextField,
} from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const FilterBar = () => {

  const router = useRouter()
  const search = useSearchParams()
  const {dispatch} = useContext(AppContext)
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setLoading(dispatch, false);
  }, [search]);


  useEffect(() => {
    const fetchTags = async () => {
      try {
        
        const getTags = await api.getImageTag();
        const { tag } = getTags
        setTags(tag);
      } catch (err) {
        console.log('Failed To Fetch Tags');
      }
    };

    fetchTags();
  }, []);


  const handleSumitFilters = (e: React.SyntheticEvent, value: string | null) => {
    if(!value) return
    setLoading(dispatch,true)
    const newPathname = updateSearchParams("tag", `${value}`);
    router.push(newPathname)
  }

  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const renderFilterTag = () => {
  
    return (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={tags}
        sx={{}}
        renderInput={(params) => <TextField {...params} label="Find By Tags" />}
        //onChange={(e,value)=> handleFilterTagChange(e, value) }
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }}
      />
    )
  };

  const renderStartEndDate = () => {
    return (
      <LocalizationProvider 
        dateAdapter={AdapterDayjs}
      >
        <DemoContainer 
          components={['DatePicker']}
        >
          <DatePicker 
            label="Select Start Date" 
          />
          <DatePicker 
            label="Select End Date" 
          />
        </DemoContainer>
    </LocalizationProvider>
    )
  };

  const renderSortBy = () => {
    return (
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={tags}
      sx={{}}
      renderInput={(params) => <TextField {...params} label="Sort By"/>}
      //onChange={(e,value)=> handleSumitFilter(e, value) }
      renderOption={(props, option) => {
        return (
          <li {...props} key={option}>
            {option}
          </li>
        );
      }}
    />
    )
  };
  
  const renderExifMake = () => {
    return (
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={tags}
      sx={{ }}
      renderInput={(params) => <TextField {...params} label="Camera Make" />}
      //onChange={(e,value)=> handleSumitFilter(e, value) }
      renderOption={(props, option) => {
        return (
          <li {...props} key={option}>
            {option}
          </li>
        );
      }}
    />
    )
  };
  
  const renderExifModel = () => {
    return (
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={tags}
      sx={{  }}
      renderInput={(params) => <TextField {...params} label="Camera Model" />}
      //onChange={(e,value)=> handleSumitFilter(e, value) }
      renderOption={(props, option) => {
        return (
          <li {...props} key={option}>
            {option}
          </li>
        );
      }}
    />
    )
  };
  


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
        <div className="grid grid-rows-2 gap-4">
          <div className="grid grid-cols-3 gap-6">
              {renderFilterTag()}
              {renderStartEndDate()}
              {renderSortBy()}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderExifMake()}
            {renderExifModel()}
          </div>
         
        </div>
      )}
    </>
  );
};

export default FilterBar;
