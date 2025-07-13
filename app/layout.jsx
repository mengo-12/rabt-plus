// import './globals.css'

// import '../i18n';
// import NavBar from '../components/NavBar'
// import Footer from "../components/Footer";
// import { dir } from 'i18next'

// export default async function LocaleLayout({ children, params }) {
//   const { locale } = await params;


//   return (
//     <html >
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600&family=Roboto:wght@400;500;700&display=swap"
//           rel="stylesheet"
//         />
//       </head>

//       <body className={locale === 'ar' ? 'font-cairo' : 'font-roboto'}>

//           <NavBar locale={locale} />
//           {children}
//           <Footer />

//       </body>
//     </html>
//   );
// }

export default function RootLayout({ children }) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}