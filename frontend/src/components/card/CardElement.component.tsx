export default function CardElement() {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white h-[400px] w-52 flex flex-col justify-between">
      <div>
        <img className="m-auto w-3/4" src="notfound.png" alt="Movie Poster" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Movie Title</div>
          <p className="text-gray-700 text-base  text-wrap truncate h-28"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque risus mi, tempus quis placerat ut, porta nec nulla. </p>
        </div>
      </div>
      <div className="p-1 overflow-x-auto custom-scrollbar">
        <div className="flex">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#Action</span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#Adventure</span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#Drama</span>
        </div>
      </div>
    </div>

  )
}