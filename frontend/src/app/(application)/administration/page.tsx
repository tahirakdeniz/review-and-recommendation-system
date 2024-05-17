'use client'
import React from 'react';
import { Input, Button } from 'antd';

const { Search } = Input;

//if(role != "ADMINISTRATION"){ {/*TODO CHECK FOR ROLE*/}
//    return (
//        <div>
//            Not Allowed
//        </div>
//)
//}
export default function Administration() {
    const merchantCandidates = [
        { companyName: 'Example Company', ownerName: 'John Doe', applicationDate: '2023-01-01', status: 'Pending' },
    ];

    return (
        <div className="p-6">
            <div className="flex flex-col">
                {/* Existing table section */}
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Owner Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Application Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {merchantCandidates.map((candidate, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {candidate.companyName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {candidate.ownerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {candidate.applicationDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">Accept</a>
                                            <a href="#" className="ml-4 text-red-600 hover:text-red-900">Decline</a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {candidate.status}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Review Fields section */}
                <div className="mt-8">
                    <div className="mx-auto shadow-lg rounded-lg overflow-hidden md:max-w-full">
                        <div className="md:flex">
                            <div className="w-full">
                                <div className="p-4 border-b border-gray-200">
                                    <span className="text-lg font-medium">Review Fields</span>
                                </div>
                                <div className="grid grid-cols-3 divide-x divide-gray-200">
                                    <div className="p-4">
                                        <button className="text-green-600 hover:text-green-800 font-bold block mb-2">Add New Field</button>
                                        <div className="bg-white p-4 shadow-sm rounded-lg">
                                            Details for adding new fields
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <button className="text-red-600 hover:text-red-800 font-bold block mb-2">Delete Field</button>
                                        <div className="bg-white p-4 shadow-sm rounded-lg">
                                            Details for deleting fields
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <button className="text-blue-600 hover:text-blue-800 font-bold block mb-2">Change Field</button>
                                        <div className="bg-white p-4 shadow-sm rounded-lg">
                                            Change review fields
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Banned Users section */}
                <div className="mt-8">
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
                                        <Search placeholder="Search banned users..." enterButton="Search" size="large" loading />
                                        <div className="mt-4 bg-white p-4 shadow-sm rounded-lg flex items-center justify-between">
                                            <span>Search results display here</span>
                                            <Button danger onClick={() => console.log('Ban user')}>Ban User</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
