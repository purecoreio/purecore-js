class Network extends Core {
  core: Core;
  uuid: string;
  name: string;

  constructor(core: Core, instance?: Instance) {
    super(core.getTool());
    this.core = core;
    if (instance != null) {
      this.uuid = instance.getId();
      this.name = instance.getName();
    }
  }

  public fromObject(object: any): Network {
    this.uuid = object.uuid;
    this.name = object.name;
    return this;
  }

  public async createServerGroup(name: String): Promise<ServerGroup> {

    let main = this;

    return new Call(this.core)
      .commit(
        {
          name: name,
          network: this.uuid
        },
        "instance/server/group/create/"
      )
      .then((jsonresponse) => {
        return new ServerGroup(main.core).fromObject(jsonresponse);
      });
  }

  public async getGroups(): Promise<Array<ServerGroup>> {

    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid
        },
        "instance/server/group/list/"
      )
      .then((jsonresponse) => {
        let serverGroups = new Array<ServerGroup>();
        jsonresponse.forEach(group => {
          serverGroups.push(new ServerGroup(main.core).fromObject(group))
        });
        return serverGroups;
      });
  }

  public async getGroupLists(): Promise<Array<ServerGroupList>> {

    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid
        },
        "instance/server/group/list/servers/"
      )
      .then((jsonresponse) => {
        let serverGroups = new Array<ServerGroupList>();
        jsonresponse.forEach(group => {
          serverGroups.push(new ServerGroupList(main.core).fromObject(group))
        });
        return serverGroups;
      });
  }


  getStore(): Store {
    return new Store(this);
  }

  getForum(): Forum {
    return new Forum(this);
  }

  getId() {
    return this.uuid;
  }

  /**
   * @param group hour, day, month, year
   */
  public async getVoteHeatmap(group: string): Promise<AnalyticGroupBase> {
    let main = this;
    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          group: group
        },
        "instance/network/voting/analytics/group"
      )
      .then((jsonresponse) => {
        return new AnalyticGroupBase().fromObject(jsonresponse);
      });
  }

  public async getDevKey(): Promise<Key> {
    let main = this;
    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "key/get/dev/"
      )
      .then((jsonresponse) => {
        return new Key(main.core).fromObject(jsonresponse);
      });
  }

  public async getKeyFromId(keyid: string): Promise<Key> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          keyid: keyid,
        },
        "key/from/id/"
      )
      .then((jsonresponse) => {
        return new Key(main.core).fromObject(jsonresponse);
      });
  }

  public async createServer(name: string): Promise<Instance> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          name: name,
          network: this.uuid
        },
        "instance/server/create/"
      )
      .then((jsonresponse) => {
        return new Instance(
          main.core,
          jsonresponse.uuid,
          jsonresponse.name,
          "SVR"
        );
      });
  }

  public async getServers(): Promise<Array<Instance>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "instance/server/list/"
      )
      .then((jsonresponse) => {
        var servers = new Array<Instance>();
        jsonresponse.forEach((serverInstance) => {
          servers.push(
            new Instance(
              main.core,
              serverInstance.uuid,
              serverInstance.name,
              "SVR"
            )
          );
        });
        return servers;
      });
  }

  public asInstance(): Instance {
    return new Instance(this.core, this.uuid, this.name, "NTW");
  }

  public async getVotingAnalytics(
    span = 3600 * 24
  ): Promise<Array<VoteAnalytic>> {
    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          span: span,
        },
        "instance/network/voting/analytics/"
      )
      .then((jsonresponse) => {
        var votingAnalytics = new Array<VoteAnalytic>();
        jsonresponse.forEach((votingAnalyticJSON) => {
          var votingAnalytic = new VoteAnalytic().fromObject(votingAnalyticJSON);
          votingAnalytics.push(votingAnalytic);
        });
        return votingAnalytics;
      });
  }

  async getVotingSites(): Promise<Array<VotingSite>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "instance/network/voting/site/list/"
      )
      .then((jsonresponse) => {
        var siteArray = new Array<VotingSite>();
        jsonresponse.forEach((votingSite) => {
          var site = new VotingSite(main.core).fromObject(votingSite);
          siteArray.push(site);
        });
        return siteArray;
      });
  }

  public async getSetupVotingSites(
    displaySetup: boolean = true
  ): Promise<Array<VotingSite | VotingSiteConfig>> {
    let main = this;
    var url;

    if (displaySetup) {
      url = "instance/network/voting/site/list/setup/config/";
    } else {
      url = "instance/network/voting/site/list/setup/";
    }

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        url
      )
      .then((jsonresponse) => {
        if (displaySetup) {
          var configArray = new Array<VotingSiteConfig>();
          jsonresponse.forEach((votingSite) => {
            var siteConfig = new VotingSiteConfig(main.core).fromObject(
              votingSite
            );
            configArray.push(siteConfig);
          });
          return configArray;
        } else {
          var siteArray = new Array<VotingSite>();
          jsonresponse.forEach((votingSite) => {
            var site = new VotingSite(main.core).fromObject(votingSite);
            siteArray.push(site);
          });
          return siteArray;
        }
      });
  }

  public async getGuild(): Promise<DiscordGuild> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "instance/network/discord/get/guild/"
      )
      .then((jsonresponse) => {
        return new DiscordGuild(main).fromObject(jsonresponse);
      });
  }

  public async setGuild(discordGuildId: string): Promise<boolean> {
    return new Call(this.core)
      .commit(
        {
          guildid: discordGuildId,
        },
        "/instance/network/discord/setguild/"
      )
      .then(() => {
        return true;
      });
  }

  public async setSessionChannel(channelId: string): Promise<boolean> {
    var key = this.core.getKey();

    return new Call(this.core)
      .commit(
        {
          channelid: channelId,
        },
        "instance/network/discord/setchannel/session/"
      )
      .then(() => {
        return true;
      });
  }

  public async setDonationChannel(channelId: string): Promise<boolean> {
    return new Call(this.core)
      .commit(
        {
          channelid: channelId,
        },
        "instance/network/discord/setchannel/donation/"
      )
      .then(() => {
        return true;
      });
  }

  public async getHashes(): Promise<Array<ConnectionHash>> {
    let main = this;
    return new Call(this.core)
      .commit({}, "session/hash/list/")
      .then((jsonresponse) => {
        var response = new Array<ConnectionHash>();
        jsonresponse.forEach((hashData) => {
          var hash = new ConnectionHash(main.core);
          response.push(hash.fromObject(hashData));
        });
        return response;
      });
  }

  public async getOffences(): Promise<Array<Offence>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "punishment/offence/list/"
      )
      .then((jsonresponse) => {
        var response = new Array<Offence>();
        jsonresponse.forEach((offenceData) => {
          var offence = new Offence(main.core);
          response.push(offence.fromObject(offenceData));
        });
        return response;
      });
  }

  public async getOffenceActions(): Promise<Array<OffenceAction>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "punishment/action/list/"
      )
      .then((jsonresponse) => {
        var response = new Array<OffenceAction>();
        jsonresponse.forEach((actionData) => {
          var offence = new OffenceAction(main.core);
          response.push(offence.fromObject(actionData));
        });
        return response;
      });
  }

  public async searchPlayers(
    username?: string,
    uuid?: string,
    coreid?: string
  ): Promise<Array<Player>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          username: username,
        },
        "player/from/minecraft/username/search/"
      )
      .then((jsonresponse) => {
        var finalPlayerList = new Array<Player>();
        jsonresponse.forEach((playerData) => {
          var player = new Player(
            main.core,
            playerData.coreid,
            playerData.username,
            playerData.uuid,
            playerData.verified
          );
          finalPlayerList.push(player);
        });
        return finalPlayerList;
      });
  }

  public async getPlayer(coreid: string): Promise<Player> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          player: coreid,
        },
        "player/from/core/id/"
      )
      .then((jsonresponse) => {
        var player = new Player(
          main.core,
          jsonresponse.coreid,
          jsonresponse.username,
          jsonresponse.uuid,
          jsonresponse.verified
        );
        return player;
      });
  }

  public async getPlayers(page?): Promise<Array<Player>> {
    let main = this;

    var queryPage = 0;
    if (page != undefined && page != null) {
      queryPage = page;
    }

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          page: queryPage,
        },
        "instance/network/list/players/"
      )
      .then((jsonresponse) => {
        var players = new Array<Player>();

        jsonresponse.forEach((playerJson) => {
          var player = new Player(
            main.core,
            playerJson.coreid,
            playerJson.username,
            playerJson.uuid,
            playerJson.verified
          );
          players.push(player);
        });

        return players;
      });
  }

  public async getPunishments(page = 0): Promise<Array<Punishment>> {
    let main = this;

    var queryPage = 0;
    if (page != undefined && page != null) {
      queryPage = page;
    }

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          page: queryPage,
        },
        "punishment/list/"
      )
      .then((jsonresponse) => {
        var response = new Array<Punishment>();
        jsonresponse.forEach((punishmentData) => {
          var punishment = new Punishment(main.core);
          response.push(punishment.fromObject(punishmentData));
        });

        return response;
      });
  }
}
