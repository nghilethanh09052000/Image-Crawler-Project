"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Autocomplete, TextField } from "@mui/material";
import { AppContext,setLoading } from "@/context/Context";
import api from "@/utils/api";
import { updateSearchParams } from "@/utils/utils";



const renderSortBy = () => {
  return <div>Nghi</div>;
};

const renderExifMake = () => {
  return <div>Nghi</div>;
};

const renderExifModel = () => {
  return <div>Nghi</div>;
};

const renderStartEndDate = () => {
  return <div>Nghi</div>;
};

const FilterBar = () => {

  const router = useRouter()
  const {dispatch} = useContext(AppContext)
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setLoading(dispatch, false);
  }, []);

  const handleSumitFilter = (e: React.SyntheticEvent, value: string | null) => {
    setLoading(dispatch,true)
    if (value) {
      const newPathname = updateSearchParams("tag", `${value}`);
      router.push(newPathname)
    }
   
  }

  
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



  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const renderFilterTag = () => {
  
    return (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={tags}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Find By Tags" />}
        onChange={(e,value)=> handleSumitFilter(e, value) }
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
                  className="flex justify-end rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                  onClick={handleOpenFilter}
                >
                  <span>Show More Filter</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
              </>
            )}
          </Disclosure>
        </div>
      </div>
      {openFilter && (
        <div className="flex justify-around">
          {renderFilterTag()}
          {renderExifMake()}
          {renderExifModel()}
          {renderStartEndDate()}
          {renderSortBy()}
        </div>
      )}
    </>
  );
};

export default FilterBar;
