'use client'
import React from 'react';
import {AdministrationMerchantRequestSection} from "@/components/AdministrationMerchantRequestSection";
import {AdministrationReviewFormSection} from "@/components/AdministrationReviewFormSection";
import {AdministrationBannedUsersSection} from "@/components/AdministrationBannedUsersSection";
import {Roles} from "@/lib/roles";
import Result403 from "@/components/Result403";

export default function Administration() {
    const role = localStorage.getItem('role');

    if (role != Roles.ADMIN) {
        return <Result403/>
    }

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4">
                <AdministrationMerchantRequestSection/>
                <AdministrationReviewFormSection/>
                <AdministrationBannedUsersSection/>
            </div>
        </div>
    );
}
