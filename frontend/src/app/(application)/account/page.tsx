'use client'
import UserProfile from "@/components/UserProfile";
import React from "react";
import Result403 from "@/components/Result403";

export default function Account() {
    const role = localStorage.getItem('role');

    if(!role) {
        return (
            <Result403/>
        )
    }

    return (
        <>
            <UserProfile />
        </>
    );
}