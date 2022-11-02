import { auth } from "../utils/firebase";
import { trpc } from "../utils/trpc";

function useCurrentUser() {
  const userQuery = trpc.user.getUserByEmail.useQuery({
    email: auth.currentUser?.email ?? null,
  });
  return userQuery.data;
}

export default useCurrentUser;
