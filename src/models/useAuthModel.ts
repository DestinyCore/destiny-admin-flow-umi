import { useCallback, useState } from 'react';

import Cookies from 'js-cookie';
import { Login } from '@/services/auth';

export default function useAuthModel() {
  let temp: Types.AuthDto = {
    accessExpires: 0,
    accessToken: '',
    nickName: '',
    userId: ''
  };
  const [auth, setAuth] = useState(temp);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async ({ account, password }: { account: string; password: string }) => {
    setLoading(true);
    await Login({ userName: account, password })
      .then((response: Types.AjaxResult) => {
        let data: Types.AuthDto = response.data;
        const { accessToken, userId } = data;
        Cookies.set('accessToken', accessToken, { path: '/' });
        Cookies.set('userId', userId, { path: '/' });
        setAuth(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const logout = useCallback(() => {
    // logout implementation
    // setUser(null)
  }, []);

  return { auth, loading, login, logout };
}
