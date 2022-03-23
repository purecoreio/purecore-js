class User {

    public readonly id: string

    constructor(id: string) {
        this.id = id
    }

    public async getProfiles(): Promise<Profile[]> {
        const profileData = await Call.commit("user/profile/list/")
        const profiles: Profile[] = []
        profileData.forEach(element => {
            profiles.push(Profile.fromObject(element))
        });
        return profiles
    }

    public static fromObject(object: any): User {
        return new User(object.id)
    }

    public asOwner(): Owner {
        return new Owner(this.id)
    }

    public async linkWallet(processor: processor): Promise<any> {
        return Popup.openPopup(await Call.commit(`user/wallet/link/${processor}`), "success", null)
    }

}