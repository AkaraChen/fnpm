import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return Array.from({ length: 8 }, (_, i) => i).map((i) => {
        return <Skeleton key={i} className='h-36' />;
    });
}
