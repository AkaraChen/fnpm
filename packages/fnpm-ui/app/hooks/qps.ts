import { useSearchParams } from '@remix-run/react';

export const useQueryParams = (key: string) => {
    const [search, setSearch] = useSearchParams();
    const value = search.get(key) || '';
    const setValue = (newValue: string) => {
        search.set(key, newValue);
        setSearch(search);
    };
    return [value, setValue] as const;
};
