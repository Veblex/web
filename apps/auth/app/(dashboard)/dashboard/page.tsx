import Link from "next/link";

export default function Page() {
    return (
        <div className="max-w-160 md:py-8">
            <section>
                <p className="mb-4 text-2xl font-semibold">Hello there!</p>
                <p className="mb-6">
                    Thank you for creating an Veblex account!
                </p>

                <p>
                    Veblex Auth is not fully complete yet, but we are actively
                    working on it. So if you have any feedback, please contact
                    us at{" "}
                    <Link
                        className="underline underline-offset-2"
                        href={"mailto:contact@veblex.com"}
                        target="_blank"
                    >
                        contact@veblex.com
                    </Link>
                    .
                </p>
            </section>

            <section className="mt-10">
                <p className="mb-4 text-xl font-semibold">What to expect</p>
                <ul className="list-disc pl-4">
                    <li>
                        Onboarding step after creating account to complete your
                        account.
                    </li>
                    <li>
                        Account managment (See and manage active sessions, edit
                        information, delete account, etc.)
                    </li>
                    <li>
                        Seemles integration with all other Veblex core products
                        (
                        <Link
                            href={"https://gym.veblex.com"}
                            target="_blank"
                            className="underline underline-offset-2"
                        >
                            Veblex Gym
                        </Link>
                        ,{" "}
                        <Link
                            href={"https://calendar.veblex.com"}
                            target="_blank"
                            className="underline underline-offset-2"
                        >
                            Veblex Calendar
                        </Link>
                        , etc.)
                    </li>
                    <li>
                        Integration with other services like{" "}
                        <Link
                            className="underline underline-offset-2"
                            href={"https://www.moviestix.com"}
                            target="_blank"
                        >
                            Moviestix
                        </Link> via SSO endpoints.
                    </li>
                </ul>
            </section>

            <section className="mt-10">
                <p className="mb-4 text-xl font-semibold">
                    Additional resources
                </p>

                <p>
                    <Link
                        className="underline underline-offset-2"
                        href={"https://www.veblex.com"}
                    >
                        Veblex.com
                    </Link>
                </p>
                <p>
                    <Link
                        className="underline underline-offset-2"
                        href={"/change-password"}
                    >
                        Change password
                    </Link>
                </p>
                <p className="mb-6">
                    <Link
                        className="underline underline-offset-2"
                        href={"/logout"}
                    >
                        Sign out
                    </Link>
                </p>

                <p>
                    If you wish to request your data, or delete your account,
                    contact us at{" "}
                    <Link
                        href={"mailto:support@veblex.com"}
                        target="_blank"
                        className="underline underline-offset-2"
                    >
                        support@veblex.com
                    </Link>
                    .
                </p>
            </section>
        </div>
    );
}
