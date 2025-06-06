import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className='mx-auto h-full w-full max-w-screen-lg grid grid-cols-2 gap-4'>
            {Array.from({ length: 8 }, (_, i) => i).map((i) => {
                return <Skeleton key={i} className='h-36' />;
            })}
        </div>
    );
}
