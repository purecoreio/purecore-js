import NetworkOwned from "../NetworkOwned";
import Network from "./Network";

export default class Branding implements NetworkOwned {

    public readonly network: Network

    private _primary: string | null
    private _secondary: string | null
    private _accent: string | null

    public get primary() { return this._primary }
    public get secondary() { return this._secondary }
    public get accent() { return this._accent }

    constructor(network: Network, primary: string | null, secondary: string | null, accent: string | null) {
        this.network = network
        this._primary = primary
        this._secondary = secondary
        this._accent = accent
    }

    public static fromObject(network: Network, obj: any) {
        return new Branding(
            network,
            obj.primary,
            obj.secondary,
            obj.accent,
        )
    }

    public async setColors(primary: string | null, secondary: string | null, accent: string | null): Promise<void> {
        await this.network.call('branding', {
            primary: primary,
            secondary: secondary,
            accent: accent
        }, 'PATCH')
        this._primary = primary
        this._secondary = secondary
        this._accent = accent
    }

}