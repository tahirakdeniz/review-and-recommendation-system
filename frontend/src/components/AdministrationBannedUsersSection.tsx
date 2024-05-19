import {Button, Input} from "antd";
import React from "react";

const { Search } = Input;

export function AdministrationBannedUsersSection() {
    return <div className="mt-8">
        <div className="mx-auto shadow-lg rounded-lg overflow-hidden md:max-w-full">
            <div className="md:flex">
                <div className="w-full">
                    <div className="p-4 border-b border-gray-200">
                        <span className="text-lg font-medium">Banned Users</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="p-4">
                            <div className="bg-white p-4 shadow-sm rounded-lg">
                                List of banned users will appear here
                            </div>
                        </div>
                        <div className="p-4">
                            <Search placeholder="Search banned users..." enterButton="Search" size="large"
                                    loading/>
                            <div
                                className="mt-4 bg-white p-4 shadow-sm rounded-lg flex items-center justify-between">
                                <span>Search results display here</span>
                                <Button danger onClick={() => console.log('Ban user')}>Ban User</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}