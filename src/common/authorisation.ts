import { Store } from "vuex";
import { AppUserEntity, PermissionScope } from "~/types";

export function authorised(
  store: Store<any>,
  allow: PermissionScope[],
  block: PermissionScope[] = []
): boolean {
  const user: AppUserEntity | null = store.getters.user;
  if (!user) {
    return false;
  }

  const userScopes: PermissionScope[] = ["authenticated"];

  // Set default or additional scopes.
  if (user._type === "admin") {
    userScopes.push(...(user.permissions.scopes ?? []));
  }
  if (user._type === "patrol") {
    // Default Patrol scopes.
    userScopes.push("stunt:canReview");
  }
  if (user._type === "stunt") {
    // Default Stunt scopes.
    userScopes.push("patrol:canScore");
    userScopes.push("stunt:canShare");
    userScopes.push("stunt:seeAll");
  }

  const normaliseScopes = userScopes.flatMap((userScope) => {
    // Return quickly if there is no wildcard detected.
    if (!userScope.indexOf("*")) {
      return userScope;
    }

    // Remove all characters except allowed ones [a-zA-Z0-9*:-]
    const sanitizedScope = userScope.replace(/[^a-zA-Z0-9*:-]/, "");
    const regex = new RegExp(sanitizedScope.replace("*", ".*"));

    // Check all scopes which are in the allow/block list,
    // If the current scope matches an allowed/blocked scope, it will be returned.
    const allowedScopesExpanded = allow.filter((scope) => scope.match(regex));
    const blockedScopesExpanded = block.filter((scope) => scope.match(regex));

    return [...allowedScopesExpanded, ...blockedScopesExpanded];
  });

  if (
    normaliseScopes.some((scope) => allow.includes(scope)) &&
    normaliseScopes.some((scope) => !block.includes(scope))
  ) {
    return true;
  }

  return false;
}
