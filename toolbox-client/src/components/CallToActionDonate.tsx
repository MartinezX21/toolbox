'use client'

import React from 'react';

import { Icon } from '@iconify/react'
import { motion } from 'framer-motion';

function CallToActionDonate() {
    return (
        <>
            <section className='w-full flex items-center justify-center pb-40 lg:px-16'>
                <div className="container">
                    <div className="bg-project-bg block md:flex justify-between items-center font-mono">
                        <h4 className="text-white dark:text-slate-200 text-3xl mb-8 md:text-4xl lg:text-5xl">
                            Did you enjoy the experience? <br />
                            We would be grateful for your support.
                        </h4>
                        <div className="w-fit">
                            <motion.a 
                                layout
                                className="
                                    block rounded-md bg-white text-gray-800
                                    hover:text-blue-600 hover:border border-blue-600 hover:scale-[0.98]
                                    p-4 px-8 font-medium whitespace-nowrap
                                " 
                                href="https://donorbox.org/kamvusoft?default_interval=o&amount=10" 
                                target='_blank'
                            >
                                <Icon icon="bi:heart-fill" className='inline' height={15} width={15}/>
                                <span className='ps-2 leading-none'>Donate Now</span>
                            </motion.a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CallToActionDonate;
