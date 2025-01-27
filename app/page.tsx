import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>
      This is landing page 
      </div>
      <Link href="/onboarding/auth/signup">
      <button className="m-2">Signup</button>
      </Link>
      <Link href="/">
      <button>Signin</button>
      </Link>

    </div>
  );
}
