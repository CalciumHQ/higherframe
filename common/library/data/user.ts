
module Common.Data {

  export interface IUser {

    // From database
    _id: String;
    name: String;

    // Client variables
    color?: String;
  }
}
