import { authorised } from "~/common/authorisation";
import { AppUserEntity, PermissionScope } from "~/types";

export default ({ store }, inject) => {
  inject("auth", (allow: PermissionScope[], block: PermissionScope[] = []) =>
    authorised(store, allow, block)
  );
  inject(
    "useUser",
    (callback: (user: AppUserEntity) => any, unauthorisedValue: string) => {
      if (store.getters.user && !callback) {
        //legacy
        return store.getters.user;
      }

      if (callback && store.getters.user) {
        return callback(store.getters.user);
      }

      return unauthorisedValue ?? false;
    }
  );
};
