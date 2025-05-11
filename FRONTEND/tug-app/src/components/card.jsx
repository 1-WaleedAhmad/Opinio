import { Link } from "react-router-dom";

const Card = ({ title, description, id, photo }) => {
  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-amber-200">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex-grow">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 md:mb-3 text-amber-800 line-clamp-2">{title}</h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 line-clamp-3 sm:line-clamp-4">{description}</p>
      </div>
      {photo && (
        <div className="px-3 sm:px-4 md:px-5 lg:px-6 pb-2 sm:pb-3">
          <img 
            src={photo} 
            alt={title} 
            className="w-full h-24 sm:h-28 md:h-32 lg:h-40 object-cover rounded-md"
          />
        </div>
      )}
      <div className="mt-auto p-2 sm:p-3 md:p-4 bg-amber-800">
        <Link to={`/article/${id}`} className="block">
          <button className="text-xs sm:text-sm md:text-base font-medium text-amber-800 hover:text-amber-300 transition-colors w-full text-left">
            Read More →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
