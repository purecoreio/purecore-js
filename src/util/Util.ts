class Util {

    private static dec2hex(dec): string {
        return dec.toString(16).padStart(2, "0")
    }

    public static generateGibberish(len): string {
        var arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return Array.from(arr, Util.dec2hex).join('')
    }

    public static shortLengthToLong(length: number): string {
        let output = ""
        let multiplyFactor = Math.floor(Math.random() * 16);
        if (multiplyFactor % 2 <= 0) {
            multiplyFactor += 1;
        }
        let componentNumber = 16 + multiplyFactor;
        output = Number(length * multiplyFactor).toString(2);
        let finalLengthStr = "";
        for (let i = 0; i < componentNumber; i++) {
            if (i == componentNumber - 1) {
                finalLengthStr += String(i) + output;
            } else {
                finalLengthStr += String(i) + output + "!@#"
            }
        }
        return btoa(finalLengthStr);
    }

    public static longLengthToShort(length: string): number {
        let bin = atob(length);
        let components = bin.split("!@#");
        let n = parseInt(components[0].substring(1, components[0].length - 1), 2) / (components.length - 16)
        return Math.floor(n * 2);
    }

    public static epoch(date: Date): number {
        return (date == null ? null : date.getTime() / 1000)
    }

    public static date(UTCSeconds: number): Date {
        if (UTCSeconds != null && UTCSeconds != 0) {
            let date = new Date(0);
            date.setUTCSeconds(UTCSeconds);
            return date;
        } else {
            return null;
        }
    }

    public static gameVal(game: string | number): Game {
        if (typeof game == 'string') {
            if (!isNaN(Number(game))) {
                game = Number(game);
            } else {
                game = String(game).toLowerCase();
                switch (true) {
                    case ['mc', 'minecraft'].includes(game):
                        game = Game.Minecraft
                        break;
                    case ['mc bedrock', 'bedrock', 'minecraft bedrock', 'minecraft_bedrock', 'minecraftbedrock'].includes(game):
                        game = Game.MinecraftBedrock
                        console.log(game);
                        break;
                    case ['se', 'spaceengineers', 'space engineers'].includes(game):
                        game = Game.SpaceEngineers
                        break;
                    default:
                        game = Game.Unknown;
                        break;
                }
            }
        }
        if (game > Game.SpaceEngineers, game < Game.Unknown) game = Game.Unknown;
        return game;
    }

    public static platformVal(platform: string | number): Platform {
        if (typeof platform == 'string') {
            if (!isNaN(Number(platform))) {
                platform = Number(platform);
            } else {
                platform = String(platform).toLowerCase();
                switch (true) {
                    case ['mojang'].includes(platform):
                        platform = Platform.Mojang
                        break;
                    case ['xbox', 'microsoft'].includes(platform):
                        platform = Platform.Xbox
                        break;
                    case ['google', 'stadia'].includes(platform):
                        platform = Platform.Stadia
                        break;
                    case ['steam', 'valve'].includes(platform):
                        platform = Platform.Steam
                        break;
                    case ['discord', 'discord-o!'].includes(platform):
                        platform = Platform.Discord
                        break;
                    case ['epic', 'epicgames'].includes(platform):
                        platform = Platform.EpicGames
                        break;
                    default:
                        platform = Platform.Unknown;
                        break;
                }
            }
        }
        if (platform > Platform.Discord, platform < Platform.Unknown) platform = Platform.Unknown;
        return platform;
    }

}