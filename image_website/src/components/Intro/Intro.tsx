import SearchBar from "@/components/Searchbar/Searchbar"

export default function Intro() {
  return (
        <div className="flex justify-center lg:mt-20">
          <div className="mx-auto max-w-7xl px-8 py-7 ">
            <div className="align-center mx-auto grid max-w-2xl grid-cols-1 gap-y-16 lg:max-w-none justify-center">
              <div className="max-w-xl lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl subpixel-antialiased font-sans">
                    The best images gallery, royalty free images for you
                </h2>
                <div className="mt-6 flex max-w-md gap-x-4">
                    <div className="flex w-full">
                        <SearchBar/>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}