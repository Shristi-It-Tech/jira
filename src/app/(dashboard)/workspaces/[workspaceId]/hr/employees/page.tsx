import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { EmployeesView } from '@/features/employees/components/employees-view';

const EmployeesPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return (
    <div className="flex h-full flex-col">
      <EmployeesView />
    </div>
  );
};

export default EmployeesPage;
