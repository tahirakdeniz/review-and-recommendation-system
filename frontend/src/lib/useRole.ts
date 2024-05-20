import {useEffect, useState} from 'react';

interface UseRoleReturn {
    error: string | null;
    isAuthorized: boolean;
}

interface useRoleParams {
    role: string;
    required?: boolean;
}

type UserRole = 'User';
type AdminRole = 'Admin' ;
type MerchantRole = 'Merchant';
export type Role = 'Admin' | 'Merchant' | 'User';


// The hook definition
export function useRole({role, required} : useRoleParams): UseRoleReturn {
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        try {
            const userRole = localStorage.getItem('role')
            if (userRole === role) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                if (required) {
                    setError('You are not authorized to access this page.');
                }
            }
        } catch (e) {
            setError('An error occurred while reading roles.');
            console.error(e);
        }
    }, [role, required]);

    return {error, isAuthorized };
}
