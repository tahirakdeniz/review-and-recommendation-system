'use client'
import MerchantProductTable from "@/components/MerchantProductTable";

export default function Merchant(){
    const role = localStorage.getItem("role");

    if(role != "MERCHANT"){
        return (
            <div>
                Not Allowed
            </div>
        )
    }

    return (
        <div>
            <MerchantProductTable/>
        </div>
    );
}