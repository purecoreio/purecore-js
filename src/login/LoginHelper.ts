import Popup from "../dom/Popup";
import Token from "./Token";

export default class LoginHelper {

    private static activeWindow: Window;

    public static async login(method: Method, scope: scope[], responseType: oAuthResponseType, clientId?: string, redirectURI?: string, state?: string, accessToken?: string): Promise<Token> {
        return Token.fromObject(await Popup.openPopup(`/oauth/authorize/${method}/?scope=${scope.join(" ")}&response_type=${responseType}${clientId != null ? `&client_id=${clientId}` : ""}${redirectURI != null ? `&redirect_uri=${redirectURI}` : ""}${state != null ? `&state=${state}` : ""}${accessToken != null ? `&access_token=${accessToken}` : ""}`, "login"))
    }

}