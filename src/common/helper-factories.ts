import { Store } from "vuex/types/index";
import { AppAlert, AppAlertOptions } from "~/common/alert";
import { AppBreadcrumb, AppBreadcrumbOptions } from "./breadcrumb";

export { AppAlertOptions };
export function createAlert(store: Store<any>, options: AppAlertOptions) {
  store.dispatch(`addAlert`, new AppAlert(options));
}

export { AppBreadcrumbOptions };
export async function setBreadcrumbs(
  store: Store<any>,
  crumbOptions: AppBreadcrumbOptions[]
) {
  return store.dispatch(
    `setBreadcrumbs`,
    crumbOptions.map((crumb) => new AppBreadcrumb(crumb))
  );
}
