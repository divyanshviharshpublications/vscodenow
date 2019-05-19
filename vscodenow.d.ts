export interface PaperspaceMachine {
  id:                     string;
  name:                   string;
  os:                     string;
  ram:                    string;
  cpus:                   number;
  gpu:                    string;
  storageTotal:           string;
  storageUsed:            string;
  usageRate:              string;
  shutdownTimeoutInHours: number;
  shutdownTimeoutForces:  boolean;
  performAutoSnapshot:    boolean;
  autoSnapshotFrequency:  null;
  autoSnapshotSaveCount:  null;
  dynamicPublicIp:        boolean;
  agentType:              string;
  dtCreated:              Date;
  state:                  string;
  updatesPending:         boolean;
  networkId:              string;
  privateIpAddress:       string;
  publicIpAddress:        null | string;
  region:                 string;
  userId:                 string;
  teamId:                 string;
  scriptId:               null;
  dtLastRun:              null;
}