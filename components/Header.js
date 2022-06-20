import styles from "../styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// Header component using <SignedIn> & <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
const Header = () => (
  <header className={styles.header}>
    <SignedOut>
      <p>
        Been here before?{" "}
        <Link href="/sign-in">
          <a className={styles.link}>Sign in</a>
        </Link>
      </p>
    </SignedOut>
    <SignedIn>
      <UserButton userProfileURL="/user" afterSignOutAll="/" afterSignOutOneUrl="/" />
    </SignedIn>
  </header>
);

export default Header;
