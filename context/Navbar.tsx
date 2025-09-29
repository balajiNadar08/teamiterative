"use client";

import Link from "next/link";
import SimpleLanguageSwitcher from "./SimpleLanguageSwitcher";
import { usePreTranslation } from "./PreTranslatedContext";

export default function Navbar() {
  const { t } = usePreTranslation();

  return (
    <div className="navbar px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium text-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/" className="text-gray-700">
                {t("Demo")}
              </Link>
            </li>
            <li>
              <Link href="/translate" className="text-gray-700">
                Translate
              </Link>
            </li>
            <li>
              <Link href="/documentation" className="text-gray-700">
                {t("Documentation")}
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="text-gray-700">
                {t("Analytics")}
              </Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          {t("NavaSetu")}
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">{t("Demo")}</Link>
          </li>
          <li>
            <Link href="/translate">{t("Translate")}</Link>
          </li>
          <li>
            <Link href="/documentation">{t("Documentation")}</Link>
          </li>
          <li>
            <Link href="/analytics">Analytics</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex items-center space-x-3">
        <SimpleLanguageSwitcher />
        {/* <a className="btn">{t('Login')}</a> */}
        <div className="border-1 border-white p-1 rounded">
          <p className="text-[0.9rem]">Dr. ProtoType</p>
        </div>
      </div>
    </div>
  );
}
