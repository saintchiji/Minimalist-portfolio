import { isAdminAuthenticated } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { AdminAuthGuard } from './auth-guard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated();
  const db = isAuth ? getDb() : null;

  return <AdminAuthGuard initialData={db} serverAuthenticated={isAuth} />;
}
