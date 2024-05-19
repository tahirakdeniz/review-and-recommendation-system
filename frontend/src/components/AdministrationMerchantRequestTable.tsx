import React from "react";
import {MerchantRequestDto} from "@/lib/dto";

export const AdministrationMerchantRequestTable = ({merchantRequest}: { merchantRequest: MerchantRequestDto[] }) => {
    return (
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col"
                                className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Firstname and Lastname
                            </th>
                            <th scope="col"
                                className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th scope="col"
                                className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request Date
                            </th>
                            <th scope="col"
                                className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {merchantRequest.length === 0 &&
                            <tr>
                                <td colSpan={4}
                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                    No data
                                </td>
                            </tr>
                        }

                        {merchantRequest.map((merchantRequest, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {merchantRequest.merchantRequestUserDto.firstName} {merchantRequest.merchantRequestUserDto.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {merchantRequest.merchantRequestUserDto.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(merchantRequest.requestDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {merchantRequest.status === 'PENDING' && (
                                        <>
                                            <span>
                                                Pending:
                                            </span>
                                            <a className="text-indigo-600 hover:text-indigo-900 ml-4"
                                               onClick={() => console.log("Accept")}>Accept</a>
                                            <a className="ml-4 text-red-600 hover:text-red-900"
                                               onClick={() => console.log("Declined")}>Decline</a>
                                        </>
                                    )}
                                    {merchantRequest.status === 'APPROVED' && (
                                        <>
                                            <span className={'text-center'}>
                                                Approved
                                            </span>
                                        </>
                                    )}
                                    {merchantRequest.status === 'REJECTED' && (
                                        <>
                                            <span className={'text-center'}>
                                                Rejected
                                            </span>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}