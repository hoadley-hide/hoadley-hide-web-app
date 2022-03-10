import { authorised } from "~/common/authorisation";
import { PermissionScope } from "~/types";

export default ({ store }, inject) => {
  inject("auth", (allow: PermissionScope[], block: PermissionScope[] = []) =>
    authorised(store, allow, block)
  );
  inject("useUser", () => store.getters.user);
};
