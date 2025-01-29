import { NextResponse } from "next/server";
import Link from "next/link";

export default async function Dashboard() {

    return <div className="flex justify-between">
        THsi si dashboard

        <Link href="/restaurant/menu">
            <button className="m-4">
                View your menu
            </button>
        </Link>

        
    </div>
    
}