class PlatformProfile {
    public id: string;
    public platformUsername: string;
    public platformid: string;
    public platformMeta: any;
    public platform: Platform;
    public isManaged: boolean;
    public isOwned: boolean;
    public creation: Date;
    public lastUpdated: Date;

    public static fromObject(object: any): PlatformProfile {
        let profile = new PlatformProfile();
        profile.id = object.id;
        profile.platformUsername = object.platformUsername;
        profile.platformid = object.platformId;
        profile.platformMeta = object.platformMeta;
        switch (object.platform) {
            case -1:
                profile.platform = Platform.Unknown;
                break;
            case 0:
                profile.platform = Platform.Mojang;
                break;
            case 1:
                profile.platform = Platform.Xbox;
                break;
            case 2:
                profile.platform = Platform.Steam;
                break;
            case 3:
                profile.platform = Platform.Stadia;
                break;
            case 4:
                profile.platform = Platform.EpicGames;
                break;
        }
        profile.isManaged = Boolean(object.isManaged);
        profile.isOwned = Boolean(object.isOwned);
        profile.creation = Util.date(object.creation);
        profile.lastUpdated = Util.date(object.lastUpdated);
        return profile;
    }

}