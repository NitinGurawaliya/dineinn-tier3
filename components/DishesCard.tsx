

interface DishCardProps{
    id:number,
    name:string,
    price:number,
    image:string,
    categoryId:number,
    restaurantId:number

}

const DishesCard:React.FC<DishCardProps>=({id,name,price,image,categoryId,restaurantId})=> {
    return (
        <div key={id} className="flex bg-white  mt-2  rounded-lg  overflow-hidden w-96  border">
            <img src={image} className="w-40 h-42 bg-gray-300"></img>

            {/* Text Section */}
            <div className="p-2 bg-gray-100 flex-1">
                {/* Dish Name & Veg Icon */}
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold">{name}</h2>
                    <div className="w-3 h-3 border border-green-600 rounded-sm"></div>
                </div>

               

                {/* Description */}
                <p className="text-gray-600 text-xs mt-2 mb-8">
                    A French-style hearty soup made with fresh broccoli served with crunchy almond slivers.
                </p>

                {/* Price */}
                <div className="mt-2 bg-red-600 w-16 px-2  text-white rounded-lg text-lg font-semibold">₹{price}</div>
            </div>
        </div>
    );
}


export default DishesCard