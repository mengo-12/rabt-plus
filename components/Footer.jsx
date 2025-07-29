'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-white border-t border-gray-200 dark:border-gray-700 py-10 mt-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* القسم الأول */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">{t('footer_about')}</h4>
                    <p className="text-sm leading-relaxed">
                        {t('footer_about_desc')}
                    </p>
                </div>

                {/* القسم الثاني */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">{t('footer_links')}</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-cyan-500">{t('nav_home')}</a></li>
                        <li><a href="#" className="hover:text-cyan-500">{t('footer_terms')}</a></li>
                        <li><a href="#" className="hover:text-cyan-500">{t('footer_privacy')}</a></li>
                        <li><a href="#" className="hover:text-cyan-500">{t('footer_contact')}</a></li>
                    </ul>
                </div>

                {/* القسم الثالث */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">{t('footer_follow')}</h4>
                    <div className="flex gap-4 text-xl">
                        <a href="#" className="hover:text-cyan-400"><FaFacebookF /></a>
                        <a href="#" className="hover:text-cyan-400"><FaTwitter /></a>
                        <a href="#" className="hover:text-cyan-400"><FaInstagram /></a>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
                &copy; {new Date().getFullYear()} {t('footer_rights')}
            </div>
        </footer>
    );
}
