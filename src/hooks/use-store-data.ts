import { auth, db } from "@/firebase";
import { DatabaseType, UserType } from "@/types/firebase-type";
import { ref } from "firebase/database";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useObjectVal } from "react-firebase-hooks/database";

export function useStoreData() {
  const [user, userLoading, userError] = useAuthState(auth);
  const [userInfo, userInfoLoading, userInfoError] = useObjectVal<UserType>(
    user ? ref(db, `users/${user.uid}`) : null
  );
  const [value, valueLoading, valueError] = useObjectVal<
    DatabaseType["stores"][string]["desks"]
  >(userInfo?.storeId ? ref(db, `stores/${userInfo.storeId}/desks`) : null);

  const desks = useMemo(
    () =>
      Object.entries(value || {})
        .map(([id, desk]) => {
          if (typeof desk !== "object" || desk === null) return null;
          return { id, ...desk };
        })
        .filter((desk): desk is NonNullable<typeof desk> => !!desk)
        .sort((a, b) => a.id.localeCompare(b.id)),
    [value]
  );

  return {
    user,
    userInfo,
    desks,
    loading: userLoading || userInfoLoading || valueLoading,
    error: userError || userInfoError || valueError
  };
}
