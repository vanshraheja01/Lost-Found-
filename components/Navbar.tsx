"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/lost", label: "I Lost Something" },
  { href: "/found", label: "I Found Something" },
  { href: "/items", label: "Browse Items" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logoContainer}>
        <Image src="/images/logo.webp" alt="HMRITM" width={55} height={55} className={styles.logo} priority />
        <div>
          <h2>Lost &amp; Found</h2>
          <span>HMRITM</span>
        </div>
      </Link>

      <nav className={styles.navLinks}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? styles.activeLink : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
