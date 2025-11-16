"use client";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-xs font-medium text-slate-700">{email}</p>
      </div>
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
        {email.charAt(0).toUpperCase()}
      </button>
    </div>
  );
}

