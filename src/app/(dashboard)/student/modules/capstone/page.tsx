import { redirect } from 'next/navigation';

export default function LegacyCapstoneIndexRedirect() {
  redirect('/student/modules/11/overview');
}
