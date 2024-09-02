import { useSearchParams } from '@remix-run/react';

export const useQueryParams = <T extends string>(
    key: string,
    defaultValue: T = '' as T,
) => {
    const [search, setSearch] = useSearchParams();
    const value: T = (search.get(key) as T) || defaultValue;
    const setValue = (newValue: T) => {
        search.set(key, newValue);
        setSearch(search);
    };
    return [value, setValue] as const;
};
