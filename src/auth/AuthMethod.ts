/**
 * @description An auth method that can be used in order to interact with purecore
 */
interface AuthMethod {

    /**
     * @description Returns the credentials used in order to authenticate the call
     */
    getCredentials(): string;

    /**
     * @description Returns the credential identifier in order to pass it as a param
     */
    getParam(): string;

}