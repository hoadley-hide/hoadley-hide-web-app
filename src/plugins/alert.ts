import { createAlert } from "~/common/helper-factories";
import { AppAlertOptions } from "~/common/alert";

export default ({ store }, inject) => {
  inject(
    "createAlert",
    async (options: AppAlertOptions) => await createAlert(store, options)
  );
};

declare module "vue/types/vue" {
  interface Vue {
    $createAlert: (options: AppAlertOptions) => Promise<void>;
  }
}
