import { redirect } from 'next/navigation';

export default function AdminRedirect() {
  redirect('/secure-access/admin');
}
