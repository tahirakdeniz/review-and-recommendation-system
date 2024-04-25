'use client'
import UserProfile from "@/components/UserProfile";
import React from "react";

export default function Account() {
    const role = localStorage.getItem('role');

    if(!role) {
        return (
            <h1>
                Not Allowed
            </h1>
        )
    }

    return (
        <>
            <UserProfile />
        </>
    );
}