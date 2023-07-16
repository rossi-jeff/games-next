"use client";

import CredentialsForm from "@/components/credentials-form";
import { apiUrl } from "@/lib/api-url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useStorage, { SessionData, sessionKey } from "../lib/session-storage";
import { useState } from "react";
import SessionButtons from "../components/session-buttons";

type LinkType = { path: string; text: string };

export default function NavBar() {
  const links: LinkType[] = [
    { path: "/yacht", text: "Yacht" },
    { path: "/guessword", text: "Guess Word" },
    { path: "/codebreaker", text: "Code Breaker" },
    { path: "/freecell", text: "Free Cell" },
    { path: "/klondike", text: "Klondike" },
    { path: "/seabattle", text: "Sea Battle" },
    { path: "/hangman", text: "Hang Man" },
    { path: "/concentration", text: "Concentration" },
    { path: "/tengrand", text: "Ten Grand" },
    { path: "/pokersquares", text: "Poker Squares" },
    { path: "/spider", text: "Spider" },
  ];
  const pathName = usePathname();

  const { setItem, getItem, removeItem } = useStorage();

  const [session, setSession] = useState<SessionData>(
    getItem(sessionKey, "session")
  );

  const showSignIn = () => {
    const modal = document.getElementById("modal-wrapper");
    const dialog = document.getElementById("sign-in");
    if (modal && dialog) {
      modal.style.display = "block";
      dialog.style.display = "block";
    }
  };

  const hideSignIn = () => {
    const modal = document.getElementById("modal-wrapper");
    const dialog = document.getElementById("sign-in");
    if (modal && dialog) {
      modal.style.display = "none";
      dialog.style.display = "none";
    }
  };

  const signIn = async (event: any) => {
    const { UserName, password } = event;
    try {
      const result = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ UserName, password }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (result.ok) {
        const { UserName, Token } = await result.json();
        const sessionData: SessionData = {
          UserName,
          Token,
          SignedIn: true,
        };
        setItem(sessionKey, sessionData, "session");
        hideSignIn();
        const current: SessionData = getItem(sessionKey, "session");
        setSession(current);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showRegister = () => {
    const modal = document.getElementById("modal-wrapper");
    const dialog = document.getElementById("register");
    if (modal && dialog) {
      modal.style.display = "block";
      dialog.style.display = "block";
    }
  };

  const hideRegister = () => {
    const modal = document.getElementById("modal-wrapper");
    const dialog = document.getElementById("register");
    if (modal && dialog) {
      modal.style.display = "none";
      dialog.style.display = "none";
    }
  };

  const register = async (event: any) => {
    const { UserName, password } = event;
    try {
      const result = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({ UserName, password }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (result.ok) {
        const user = await result.json();
        console.log(user);
        hideRegister();
        showSignIn();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = () => {
    removeItem(sessionKey, "session");
    const current: SessionData = getItem(sessionKey, "session");
    setSession(current);
  };

  return (
    <nav id="nav-bar">
      <div className="flex flex-wrap justify-between min-h-fit pb-1">
        <h1>Games By Jeff Rossi</h1>
        <div className="flex flex-wrap justify-end">
          <SessionButtons
            session={session}
            showRegister={showRegister}
            showSignIn={showSignIn}
            signOut={signOut}
          />
        </div>
      </div>
      <div
        id="main-links"
        className="flex flex-wrap justify-between min-h-fit pt-1"
      >
        <Link href="/" className={pathName == "/" ? "active" : ""}>
          Home
        </Link>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.path}
            className={pathName.match(link.path) ? "active" : ""}
          >
            {link.text}
          </Link>
        ))}
      </div>
      <div id="modal-wrapper" className="modal-wrapper">
        <CredentialsForm
          label="Sign In"
          id="sign-in"
          submit={signIn}
          cancel={hideSignIn}
        />
        <CredentialsForm
          label="Register"
          id="register"
          submit={register}
          cancel={hideRegister}
        />
      </div>
    </nav>
  );
}
