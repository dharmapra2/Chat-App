import bcrypt from "bcrypt";
class BaseData {
  saltRounds: number;
  constructor() {
    this.saltRounds = 10;
  }
  genrateHashPass = async (password: any) => {
    try {
      const result = await bcrypt.hash(password, this.saltRounds);
      return result;
    } catch (error) {
      throw error;
    }
  };
  comparePass = async (password: any, comparePassword: string) => {
    try {
      return await bcrypt.compare(password, comparePassword);
    } catch (error) {
      throw error;
    }
  };
}
export const GlobalData = new BaseData();
