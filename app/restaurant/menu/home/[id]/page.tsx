import HomePage from "@/components/HomePage";
import axios from "axios"


async function getData(id:string) {
    try {
        const res = await axios.get(`http://localhost:3000/api/menu/${id}`)
        return res.data;
    
    } catch (error) {
        console.error("Error fetching post:", error);
    return null;
    }
    
}

export default async function RestaurantHomePage({params}:{params:{id:string}}){

    const details = await getData(params.id)
    console.log(details)

    return <div>
            <HomePage logo={details.logo} restaurantName={details?.restaurantName} id={details.id} instagram={details.instagram} location={details.location} whatsapp={details.contactNumber} contactNumber={details.contactNumber}  />
    </div>
}

