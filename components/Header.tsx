"use client";

import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Breadcrumbs from "./Breadcrumbs";
const Header = () => {
    const { user } = useUser();
    return (
        <div className="container m-auto"><div className='flex justify-between px-4  items-center my-4'>


            {
                user && (
                    <h1>
                        {user?.firstName}{`'s`} Space
                    </h1>
                )
            }

            <Breadcrumbs />

            <div className="flex justify-center items-center">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>


        </div></div>
    )
}

export default Header