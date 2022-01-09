class User {

    public async getProfiles(): Promise<Profile[]> {
        const profileData = await Core.call("/rest/3/user/profile/list/")
        const profiles: Profile[] = []
        profileData.forEach(element => {
            profiles.push(Profile.fromObject(element))
        });
        return profiles
    }

}