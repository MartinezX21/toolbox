import React from 'react';

import Link from 'next/link';
import Svg from '@/components/Svg';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Box, Grid } from '@mui/material';

function NotFound() {
    
    return (
        <>
            <div className="py-10 flex justify-center">
                <div className='md:w-1/2 px-5'>
                    <div className="flex flex-col justify-center items-center">
                        <Svg />
                        <div className="text-center">
                            <span className='block text-red-600 pt-8 font-extrabold text-5xl'>Sorry!</span>
                            <h3 className="py-4 font-extrabold text-5xl text-slate-900 dark:text-slate-400">The page can’t be found.</h3>
                            <p className='pb-8 text-gray-500'>
                                The page you’re looking for isn’t available.
                            </p>
                            <Link href="/" className='p-3 bg-red-500 text-white rounded shadow-md hover:shadow-lg'>
                                <span>Return Home </span>
                                <Icon icon="bi:arrow-right" className='inline' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;