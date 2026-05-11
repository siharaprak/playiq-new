import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Module10IndexPage() {
  redirect('/student/modules/2/overview');
}
