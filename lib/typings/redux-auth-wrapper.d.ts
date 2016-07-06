interface UserAuthWrapperConfig {
  [key: string]: any;
}

interface UserAuthWrapperFactory {
  (options: UserAuthWrapperConfig): (any) => any;
}

declare module "redux-auth-wrapper" {
    var UserAuthWrapper: UserAuthWrapperFactory;
}
