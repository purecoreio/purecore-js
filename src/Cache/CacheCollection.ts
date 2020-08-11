class CacheCollection {

  // props

  public instanceCaches: Array<InstanceCache>;

  public socketAssociation: object;
  public uuidAssociation: object;

  public executions: Array<Execution>;

  public loadingExecutions: Array<Instance>;
  public loadedExecutions: Array<Instance>;

  public executors: object;

  // events

  private readonly onCommandEvent = new LiteEvent<CommandEvent>();
  private readonly onCommandsLoadingEvent = new LiteEvent<void>();
  private readonly onCommandsLoadedEvent = new LiteEvent<void>();

  public get onCommand() { return this.onCommandEvent.expose(); }
  public get onCommandsLoading() { return this.onCommandsLoadingEvent.expose(); }
  public get onCommandsLoaded() { return this.onCommandsLoadedEvent.expose(); }

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

    this.executions = new Array<Execution>();
    this.loadingExecutions = new Array<Instance>();
    this.loadedExecutions = new Array<Instance>();
    this.executors = {}
  }

  // CONNECTION AND DISCONNECT

  public disconnect(socketId) {
    if (this.getCacheBySocket(socketId) != null) {
      this.removeCache(this.getCacheBySocket(socketId).createdOn.getTime());
    }
  }

  public getExecutors(instance: Instance): Array<any> {
    var executors = new Array<any>();
    if (instance.uuid in executors) {
      executors[instance.uuid].forEach(socketId => {
        executors.push(socketId);
      });
    }
    return executors;
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

      // remove possible executor
      if (cache.instance.uuid in this.executors) {
        if (this.executors[cache.instance.uuid].length > 1) {
          this.executors[cache.instance.uuid].splice(this.executors[cache.instance.uuid].indexOf(socketId), 1);
        } else {
          delete this.executors[cache.instance.uuid];
        }
      }

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

    // remove cache
    this.instanceCaches.splice(this.instanceCaches.indexOf(cache), 1);

  }

  // DATA QUERY

  public setExecutor(socketId) {
    let cache = this.getCacheBySocket(socketId);
    if (cache != null) {
      if (cache.instance.uuid in this.executors) {
        this.executors[cache.instance.uuid].push(socketId);
      } else {
        this.executors[cache.instance.uuid] = [socketId]
        this.loadExecutions(cache.instance, "offline", 1);
      }
    }
  }

  public loadExecutions(instance: Instance, type: string, page: number) {

    // if the executions have not been loaded or are being loaded already...

    let firstRun = (type == "offline" && page == 0 && this.loadingExecutions.indexOf(instance) === -1 && this.loadedExecutions.indexOf(instance) === -1);
    if (firstRun) this.onCommandsLoadingEvent.trigger();

    if (firstRun || type != "offline") {

      if (firstRun) this.loadingExecutions.push(instance);

      instance.getPendingExecutions(type, page).then((executions) => {
        executions.forEach(execution => {
          if (!this.executions.includes(execution)) {
            this.executions.push(execution);
          }
        });
        if (executions.length <= 20) {
          this.loadExecutions(instance, type, page + 1);
        } else if (type == "offline") {
          this.loadExecutions(instance, "online", 0);
        } else {
          this.loadingExecutions.splice(this.loadingExecutions.indexOf(instance), 1);
          this.loadedExecutions.push(instance);
          this.onCommandsLoadedEvent.trigger();
        }
      })

    }
  }

  public getCacheByEpoch(epoch): InstanceCache {
    var value = null;
    this.instanceCaches.forEach((instanceCache) => {
      if (instanceCache.createdOn.getTime() == epoch) {
        value = instanceCache;
      }
    });
    return value;
  }

  public getCacheBySocket(socketId): InstanceCache {
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

  // DATA SENDING

  public sendCommandBatch(executions: Array<Execution>) {
    let organizedDestinations = {};
    executions.forEach(execution => {
      execution.instances.forEach(instance => {
        if (!execution.executedOn.includes(instance) && this.getCachesByInstance(instance).length > 0) {
          // if it hasn't been executed yet and instance is connected to the socket server...
          if (!(instance.uuid in organizedDestinations)) {
            organizedDestinations[instance.uuid] = new Array<Execution>();
          }
          organizedDestinations[instance.uuid].push(execution);
        }
      });
    });

    for (var key in organizedDestinations) {
      // skip loop if the property is from prototype
      if (!organizedDestinations.hasOwnProperty(key)) continue;

      var instanceExecutions = organizedDestinations[key];
      if (key in this.executors) {
        // get every available executor for that instance
        this.executors[key].forEach(executor => {
          // send oncommand event for every available executor for that instance
          this.onCommandEvent.trigger(new CommandEvent(executor, instanceExecutions))
        });
      }
    }
  }

}
