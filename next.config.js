const withFlowbiteReact = require("flowbite-react/plugin/nextjs");


/** @type {import('next').NextConfig} */
const nextConfig = {
    // i18n,
    output: 'standalone',
    images: {
        domains: ['res.cloudinary.com', /* أضف دومين cloudinary الخاص بك هنا */],
    },
};



module.exports = withFlowbiteReact(nextConfig);