const TravelSkeleton = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      
        <div className="flex justify-end space-x-4 mb-8">
          <div className="w-40 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-40 h-10 bg-gray-200 rounded-md"></div>
        </div>
  
        {/* Kart yapısı */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-6 bg-gray-200 rounded-md w-64 h-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-5 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
  
        {/* Sol tarafta başlık ve grid yapısı */}
        <div className="text-2xl font-bold text-gray-900 mb-6 bg-gray-200 rounded-md w-48 h-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Resim alanı */}
              <div className="h-[256px] bg-gray-200"></div> 
              {/* İçerik alanı */}
              <div className="p-6">
                <div className="text-xl font-bold text-gray-900 mb-2 bg-gray-200 rounded-md w-3/4 h-6"></div>
                <div className="text-gray-600 mb-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                </div>
                {/* Alt tarafta yan yana 2 içerik */}
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
                  <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* İki grid arasına boşluk */}
        <div className="my-12"></div>
  
        {/* Sol tarafta başlık ve grid yapısı */}
        <div className="text-2xl font-bold text-gray-900 mb-6 bg-gray-200 rounded-md w-48 h-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Resim alanı */}
              <div className="h-[256px] bg-gray-200"></div>
              {/* İçerik alanı */}
              <div className="p-6">
                <div className="text-xl font-bold text-gray-900 mb-2 bg-gray-200 rounded-md w-3/4 h-6"></div>
                <div className="text-gray-600 mb-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                </div>
                {/* Alt tarafta yan yana 2 içerik */}
                <div className="flex items-center space-x-4">
                <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* İki grid arasına boşluk */}
        <div className="my-12"></div>
  
        {/* Kart yapısı */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-6 bg-gray-200 rounded-md w-64 h-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-5 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
  
        {/* Kart yapısı */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-6 bg-gray-200 rounded-md w-64 h-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-5 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
  
        {/* Kart yapısı */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-6 bg-gray-200 rounded-md w-64 h-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-5 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
  
      </div>
    );
  };
  
  export default TravelSkeleton;
  