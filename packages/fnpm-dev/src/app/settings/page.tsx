import { Button } from '@/components/ui/button';
import { Title } from './common';
import { Item } from './item';

export default function Settings() {
    return (
        <div className='mx-auto max-w-screen-md w-full'>
            <Title>Preferences</Title>
            <div className='space-y-4 w-full'>
                <Item
                    title='Favorites'
                    description='Favorites items will be displayed in the sidebar.'
                    vertical
                >
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <input type='text' />
                            <Button variant='outline'>Save</Button>
                        </div>
                    </div>
                </Item>
            </div>
        </div>
    );
}
