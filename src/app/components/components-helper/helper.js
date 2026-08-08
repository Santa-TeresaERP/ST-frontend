
export const hasPermission = (user, module, permission) => {
    return user && user.modules && user.modules[module] && user.modules[module][permission];
  };
  