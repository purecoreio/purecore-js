import HostingImage from "./HostingImage"

export default class ResourceTemplate {

    public readonly id: string
    private _cores: number
    private _memory: number
    private _storage: number | null
    private _pricing: number
    private _images: HostingImage[]

    public get cores(): number { return this._cores }
    public get memory(): number { return this._memory }
    public get storage(): number | null { return this._storage }
    public get pricing(): number { return this._pricing }
    public get images(): HostingImage[] { return this._images }

    constructor(id: string, cores: number, memory: number, storage: number | null, pricing: number, images: HostingImage[]) {
        this.id = id
        this._cores = cores
        this._memory = memory
        this._storage = storage
        this._pricing = pricing
        this._images = images
    }

    public static fromObject(obj: any): ResourceTemplate {
        return new ResourceTemplate(
            obj.id,
            obj.cores,
            obj.memory,
            obj.storage,
            obj.pricing,
            obj.images.map(i => HostingImage.fromObject(i))
        )
    }

    // https://stackoverflow.com/a/70592485/7280257
    private formatBytes(bytes: number): string {
        var units = ['B', 'KB', 'MB', 'GB', 'TB'], i;

        for (i = 0; bytes >= 1024 && i < 4; i++) {
            bytes /= 1024;
        }

        return bytes.toFixed(2) + units[i];
    }

    public get formattedMemory(): string { return this.formatBytes(this.memory) }
    public get formattedStorage(): string { return this.storage ? this.formatBytes(this.storage) : '∞' }

}