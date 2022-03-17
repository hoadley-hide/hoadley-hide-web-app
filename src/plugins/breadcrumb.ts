import { AppBreadcrumbOptions, setBreadcrumbs } from "~/common/breadcrumb";

export default ({ store }, inject) => {
  inject(
    "setBreadcrumbs",
    async (options: AppBreadcrumbOptions[]) =>
      await setBreadcrumbs(store, options)
  );
};

declare module "vue/types/vue" {
  interface Vue {
    $setBreadcrumbs: (options: AppBreadcrumbOptions[]) => Promise<void>;
  }
}
