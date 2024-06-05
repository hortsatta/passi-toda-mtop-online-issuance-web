import { BaseScene } from '#/base/components/base-scene.component';
import { UserRole } from '../models/user.model';
import { useUser } from '../hooks/use-user.hook';
import { UserCreateForm } from '../components/user-create-form.component';

export function MemberUserRegisterPage() {
  const { register } = useUser();

  return (
    <BaseScene pageTitle='Sign Up'>
      <UserCreateForm onSubmit={register} userRole={UserRole.Member} />
    </BaseScene>
  );
}
