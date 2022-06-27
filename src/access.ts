/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import { getUserInfo } from '@/utils/myAuth';

export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  // const { currentUser } = initialState ?? {};
  const currentUser = getUserInfo();
  console.log('currentUseradmin', currentUser);

  return {
    canAdmin: currentUser && currentUser.username === 'admin',
  };
}
