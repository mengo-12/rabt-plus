// components/ui/Button.jsx
'use client';

import React from 'react';
import clsx from 'clsx';

export default function Button({ children, className, ...props }) {
    return (
        <button
            className={clsx(
                'inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all',
                'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
