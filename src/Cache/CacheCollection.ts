class CacheCollection {
  public instanceCaches: Array<InstanceCache>;

  public socketAssociation: object;
  public uuidAssociation: object;

  constructor(
    instanceCaches?: Array<InstanceCache>,
    uuidAssociation?: object,
    socketAssociation?: object
  ) {
    if (instanceCaches != null) {
      this.instanceCaches = instanceCaches;
    } else {
      this.instanceCaches = new Array<InstanceCache>();
    }

    if (uuidAssociation != null) {
      this.uuidAssociation = uuidAssociation;
    } else {
      this.uuidAssociation = {};
    }

    if (socketAssociation != null) {
      this.socketAssociation = socketAssociation;
    } else {
      this.socketAssociation = {};
    }
  }

  // CONNECTION AND DISCONNECT

  public disconnect(socketId) {
    this.removeCache(this.getCacheBySocket(socketId).createdOn.getTime());
  }

  public async connect(socketId, keyStr) {
    let main = this;
    var credentials = new Core(keyStr);
    return await credentials
      .getLegacyKey()
      .update()
      .then(function (keyData) {
        var cache = new InstanceCache(credentials, keyData.instance);
        main.socketAssociation[socketId] = cache.createdOn.getTime();
        if (!(cache.instance.uuid in main.uuidAssociation)) {
          main.uuidAssociation[cache.instance.uuid] = [];
        }
        main.uuidAssociation[cache.instance.uuid].push(
          cache.createdOn.getTime()
        );
        main.instanceCaches.push(cache);
        return true;
      });
  }

  // DATA REMOVAL

  public removeCache(epoch) {
    var cache = this.getCacheByEpoch(epoch);
    cache.flush();

    // remove assoc (sockets)

    var socketIdsToRemove = [];
    for (const key in this.socketAssociation) {
      if (this.socketAssociation.hasOwnProperty(key)) {
        const element = this.socketAssociation[key];
        if (element.createdOn == epoch) {
          socketIdsToRemove.push(key);
        }
      }
    }

    socketIdsToRemove.forEach((socketId) => {
      delete this.socketAssociation[socketId];
    });

    // remove assoc (instance ids)
    var newAssoc = this.uuidAssociation[cache.instance.uuid].filter(function (
      item
    ) {
      return item !== epoch;
    });
    if (newAssoc.length == 0) {
      delete this.uuidAssociation[cache.instance.uuid];
    } else {
      this.uuidAssociation[cache.instance.uuid] = newAssoc;
    }
  }

  // DATA QUERY

  public getCacheByEpoch(epoch): InstanceCache {
    var value = null;
    this.instanceCaches.forEach((instanceCache) => {
      if (instanceCache.createdOn.getTime() == epoch) {
        value = instanceCache;
      }
    });
    return value;
  }

  public getCacheBySocket(socketId) {
    return this.getCacheByEpoch(this.socketAssociation[socketId]);
  }

  public getCachesByInstance(instance: Instance): Array<InstanceCache> {
    var cacheList = new Array<InstanceCache>();
    this.uuidAssociation[instance.uuid].forEach((epoch) => {
      var cache = this.getCacheByEpoch(epoch);
      if (cache != null) {
        cacheList.push(cache);
      }
    });
    return cacheList;
  }
}
