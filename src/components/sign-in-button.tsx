"use client";

export interface SignInButtonProps {
  provider?: "github" | "email";
}

export function SignInButton({ provider = "github" }: SignInButtonProps) {
  return (
    <form action="/api/auth/signin" method="post">
      <input type="hidden" name="providerId" value={provider} />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Sign in with {provider}
      </button>
    </form>
  );
}
