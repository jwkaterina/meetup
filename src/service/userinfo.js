import { Auth, API } from "aws-amplify";
import User from "../user";

export default class UserInfoService {

  /*
  * This limit applied by AWS Cognito Service
  */
  static get MAX_USERS_PER_REQUEST() {
      return 60;
  }

  async listUsers() {
    const users = [];

    const req = {
      limit: UserInfoService.MAX_USERS_PER_REQUEST,
      nextToken: null,
    };

    do {
      const res = await this.sendListUsersInGroupRequest(req, "user");
      const inUsersGroup = this.processUsersResult(res);
      users.push(...inUsersGroup);
    } while (req.nextToken != null);

    return users;
  }


  async listEditors() {
    const users = [];

    const req = {
      limit: UserInfoService.MAX_USERS_PER_REQUEST,
      nextToken: null,
    };

    do {
      const res = await this.sendListUsersInGroupRequest(req, "editor");
      const inEditorsGroup = this.processUsersResult(res);
      users.push(...inEditorsGroup);
    } while (req.nextToken != null);

    return users;
  }

  async sendListUsersInGroupRequest(req, group){
    const apiName = 'AdminQueries';
    const path = '/listUsersInGroup';
    const init = { 
      queryStringParameters: {
        "groupname": group,
        "limit": req.limit,
        "token": req.nextToken
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: await this.getAuthHeader()
      }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, init);
    req.nextToken = NextToken;
    
    return rest;
  }

  processUsersResult(result) {
    if (!result || !result.Users) {
      return [];
    }

    const users = result.Users;
    
    return users.map((user) => {
      const attr = user.Attributes.reduce((acc, cur) => {
        acc[cur.Name] = cur.Value
        return acc;
      }, {});

      return new User(user.Username, attr.given_name, attr.family_name);
    });
  }

  async getAuthHeader() {
    return `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
  }
}