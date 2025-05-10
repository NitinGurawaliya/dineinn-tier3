
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, UserIcon } from "lucide-react";

interface NavbarProps {
  id:string
  restaurantName: string;
  logo: string;
}

export const Navbar: React.FC<NavbarProps> = ({ restaurantName, logo }) => {
  return (
    <nav className="bg-white w-full border-b-2 p-1 shadow-xl border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="w-full flex items-center justify-between px-2 py-2">
        <div className="flex items-center space-x-3">
          <img src={logo} className="h-12 w-12" alt="Restaurant Logo" />
          <span className="text-2xl font-semibold dark:text-white">{restaurantName}</span>
        </div>
        <div className="border-2 border-gray-200    p-2 rounded-full">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback> <UserIcon /></AvatarFallback>
                </Avatar>
                </div>
      </div>
    </nav>
  );
};


export const Dashboard_Navbar: React.FC<NavbarProps> = ({ restaurantName, logo }) => {
  return (
    <nav className="bg-white w-full border-b-2 p-1 shadow-xl border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="w-full flex items-center justify-between px-2 py-2">
        <div className="flex items-center space-x-3">
          <img src={logo} className="h-12 w-12" alt="Restaurant Logo" />
          <span className="text-2xl font-semibold dark:text-white">{restaurantName}</span>
        </div>
        <div className="border-2 border-gray-200    p-2 rounded-full">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback> <UserIcon /></AvatarFallback>
                </Avatar>
                </div>
      </div>
    </nav>
  );
};




















































// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';

// interface NavbarProps{
//     id:string,
//     restaurantName:string,
//     logo:string
// }

// const Navbar:React.FC<NavbarProps>=({id,restaurantName,logo  }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className="bg-white w-full border-b-2 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         <div  className="flex items-center space-x-3">
//           <img src={logo} className="h-12 w-12" alt="Flowbite Logo" />
//           <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{restaurantName}</span>
//         </div>
//         <button 
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//         >
//           <span className="sr-only">Open main menu</span>
//           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
//             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
//           </svg>
//         </button>
//         <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
//           <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//             {/* <li>
//               <Link href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:bg-blue-600 md:dark:bg-transparent">Home</Link>
//             </li> */}
//             <li className="relative">
//               {/* <button 
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
//                 className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
//               >
//                 Dropdown
//                 <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
//                 </svg>
//               </button> */}
//               {isDropdownOpen && (
//                 <div className="absolute left-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
//                   <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
//                     <li><Link href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link></li>
//                     <li><Link href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</Link></li>
//                     <li><Link href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</Link></li>
//                   </ul>
//                   <div className="py-1">
//                     <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</Link>
//                   </div>
//                 </div>
//               )}
//             </li>
//             {/* <li><Link href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white">Services</Link></li>
//             <li><Link href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white">Pricing</Link></li>
//             <li><Link href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white">Contact</Link></li> */}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
